import { Config, Inject, Logger, Provide } from '@midwayjs/decorator';
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
  @Config('rabbitmq')
  mqConfig;
  @Inject()
  redisService: RedisService;

  getModel(): Repository<Article> {
    return this.articleModel;
  }

  @Logger()
  logger: ILogger;
  @Inject()
  ctx: Context;

  async pageArticle(pageVo: PageVo, id = '') {
    const where = {};
    if (id) {
      where['id'] = id;
    }

    if (this.ctx.headers.system !== 'admin') {
      where['isRelease'] = true;
    }
    const [records, total] = await this.articleModel.findAndCount({
      ...page2sql(pageVo),
      where,
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
      take: 5,
    });
  }

  async articleAside() {
    return {};
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
        60 * 30
      );
      await this.redisService.zadd('viewCount', 'INCR', 1, id);
    }
    return true;
  }

  async saveArticle(article: Article) {
    if (article.id) {
      await this.rabbitmqService.sendToQueue(this.mqConfig.queue, {
        id: article.id,
        action: 'update',
      });
      return await this.articleModel.save(article);
    } else {
      article.id = this.idGenerate.nextId().toString();
      await this.articleModel.save(article);
      await this.rabbitmqService.sendToQueue(this.mqConfig.queue, {
        id: article.id,
        action: 'add',
      });
      return article;
    }
  }

  async db2es(id: string) {
    const elasticsearch = this.elasticsearchService.get();
    const article = await this.articleModel.findOneBy({ id });
    const { body } = await elasticsearch.exists({
      index: 'blog',
      id,
    });
    if (body) {
      elasticsearch.update({
        index: 'blog',
        id: article.id,
        body: { doc: article },
      });
    } else {
      elasticsearch.index({
        index: 'blog',
        id: article.id,
        body: article,
      });
    }
  }

  async topSearch() {
    return this.redisService.zrange('searchKeywords', 0, 10, 'REV');
  }
  async deleteArticle(id: string) {
    return this.articleModel.softDelete(id);
  }
  async resetEs() {
    const elasticsearch = this.elasticsearchService.get();
    await elasticsearch.indices.delete({
      index: 'blog',
    });
    await elasticsearch.indices.create({
      index: 'blog',
    });
    elasticsearch.indices.put_mapping({
      index: 'blog',
      body: {
        properties: {
          title: {
            type: 'text',
            analyzer: 'ik_max_word',
            search_analyzer: 'ik_smart',
          },
          tag: {
            type: 'text',
            analyzer: 'ik_max_word',
            search_analyzer: 'ik_smart',
          },
          is_release: {
            type: 'short',
          },
          content: {
            type: 'text',
            analyzer: 'ik_max_word',
            search_analyzer: 'ik_smart',
          },
        },
      },
    });
    const list = await this.articleModel.find({
      withDeleted: true,
    });
    await elasticsearch.bulk({
      body: list.flatMap(doc => [
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
