import { Inject, Logger, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Article } from '../entity/Article';
import { PageVo } from '../vo/PageVo';
import { ILogger } from '@midwayjs/logger';
import { BaseService } from './BaseService';
import { Repository } from 'typeorm';
import { ElasticsearchServiceFactory } from '@oc/midway-es';
import { SnowflakeIdGenerate } from './Snowflake';
import { RabbitmqService } from './rabbitmq';
import { page2sql } from '../vo/page2sql';
import { RedisService } from '@midwayjs/redis';
import { Context } from '@midwayjs/koa';
import { getUserIp } from '../util/httpUtil';

@Provide()
export class ArticleService extends BaseService<Article> {
  @InjectEntityModel(Article)
  articleModel;
  @Inject()
  elasticsearchService: ElasticsearchServiceFactory;
  @Inject()
  rabbitmqService: RabbitmqService;
  @Inject()
  idGenerate: SnowflakeIdGenerate;
  @Inject()
  redisService: RedisService;

  getModel(): Repository<Article> {
    return this.articleModel;
  }

  @Logger()
  logger: ILogger;
  @Inject()
  ctx: Context;

  async pageArticle(pageVo: PageVo, id = '', scope = 'all') {
    let isRelease = undefined;
    if (this.ctx.headers.system === 'admin' && scope !== 'published') {
      if (scope === 'all') {
        isRelease = undefined;
      }
      if (scope === 'unpublished') {
        isRelease = false;
      }
    } else {
      isRelease = true;
    }
    const [records, total] = await this.articleModel.findAndCount({
      ...page2sql(pageVo),
      where: {
        id: id || undefined,
        isRelease,
      },
      order: {
        orderNum: 'DESC',
        createTime: 'DESC',
      },
    });
    return { records, total };
  }

  async lastUpdated() {
    return this.articleModel.find({
      where: {
        isRelease: true,
      },
      order: {
        updateTime: 'DESC',
      },
      take: 6,
    });
  }

  async lastCreated() {
    return this.articleModel.find({
      where: {
        isRelease: true,
      },
      order: {
        createTime: 'DESC',
      },
      take: 6,
    });
  }

  async sortByField(field: string) {
    return this.articleModel
      .createQueryBuilder('article')
      .where('article.isRelease', true)
      .orderBy(field, 'DESC')
      .limit(8)
      .getMany();
  }

  async articleCount() {
    const result = await this.articleModel
      .createQueryBuilder('article')
      .where('article.isRelease', true)
      .groupBy('article.tag')
      .getMany();
    return {
      article: await this.articleModel.count({ where: { isRelease: true } }),
      tag: result.length,
    };
  }

  async articleList(code: string) {
    let where: Record<string, any> = {
      isRelease: true,
    };
    if (code) {
      where = { tag: code };
    }
    return {
      title: code,
      articleList: await this.articleModel.find({
        where,
        select: ['id', 'title', 'createTime'],
        order: {
          createTime: 'DESC',
        },
      }),
    };
  }

  async articleTags() {
    return await this.articleModel
      .createQueryBuilder('article')
      .select('COUNT(article.id)', 'count')
      .addSelect('article.tag', 'tag')
      .groupBy('article.tag')
      .where('article.isRelease', true)
      .getRawMany();
  }

  async updateViewed(id: string) {
    const exists = await this.redisService.exists(
      `isViewed::${id}::${getUserIp(this.ctx)}`
    );
    if (!exists) {
      await this.redisService.set(
        `isViewed::${id}::${getUserIp(this.ctx)}`,
        Date.now(),
        'EX',
        60 * 10
      );
      await this.articleModel
        .createQueryBuilder('article')
        .update(Article)
        .set({
          viewCount: () => 'viewCount + 1',
          updateTime: () => 'updateTime',
        })
        .where('id = :id', { id })
        .execute();
      // await this.redisService.zadd('viewCount', 'INCR', 1, id);
    }
    return true;
  }

  async saveArticle(article: Article) {
    if (article.id) {
      await this.rabbitmqService.sendToQueue(
        `article_${process.env.NODE_ENV}`,
        {
          id: article.id,
          action: 'update',
        }
      );
      return await this.articleModel.save(article);
    } else {
      article.id = this.idGenerate.nextId().toString();
      await this.articleModel.save(article);
      await this.rabbitmqService.sendToQueue(
        `article_${process.env.NODE_ENV}`,
        {
          id: article.id,
          action: 'add',
        }
      );
      return article;
    }
  }

  async db2es(id: string) {
    const elasticsearch = this.elasticsearchService.get();
    const article = await this.articleModel.findOneBy({ id });
    const hasExists = await elasticsearch.exists({
      index: 'blog',
      id,
    });
    if (hasExists) {
      await elasticsearch.update({
        index: 'blog',
        id: article.id,
        doc: article,
      });
    } else {
      await elasticsearch.index({
        index: 'blog',
        id: article.id,
        document: article,
      });
    }
  }

  async topSearch() {
    return this.redisService.zrevrange('searchKeywords', 0, 10);
  }

  async deleteArticle(id: string) {
    return this.articleModel.softDelete(id);
  }

  async resetEs() {
    const elasticsearch = this.elasticsearchService.get();
    try {
      await elasticsearch.indices.delete({
        index: 'blog',
      });
    } catch (error) {
      
    }
    await elasticsearch.indices.create({
      index: 'blog',
    });
    await elasticsearch.indices.putMapping({
      index: 'blog',
      properties: {
        title: {
          type: 'text',
          // analyzer: 'ik_max_word',
          // search_analyzer: 'ik_smart',
        },
        tag: {
          type: 'text',
          // analyzer: 'ik_max_word',
          // search_analyzer: 'ik_smart',
        },
        is_release: {
          type: 'short',
        },
        content: {
          type: 'text',
          // analyzer: 'ik_max_word',
          // search_analyzer: 'ik_smart',
        },
      },
    });
    const list = await this.articleModel.find({
      withDeleted: true,
    });
    await elasticsearch.bulk({
      operations: list.flatMap(doc => [
        { index: { _index: 'blog', _id: doc.id } },
        {
          title: doc.title,
          tag: doc.tag.name,
          summary: doc.summary,
          isRelease: doc.isRelease,
          createTime: doc.createTime,
          updateTime: doc.updateTime,
          deleteTime: doc.deleteTime,
          content: doc.content,
        },
      ]),
    });
    return true;
  }
}
