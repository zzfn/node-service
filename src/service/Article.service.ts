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

@Provide()
export class ArticleService extends BaseService<Article> {
  public entity: Repository<Article>;
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
    const where: Record<string, any> = {
      isRelease: true,
    };
    if (code) {
      where.tag = code;
    }
    return this.articleModel.find({
      where,
      select: ['id', 'title', 'createTime'],
      order: {
        createTime: 'DESC',
      },
    });
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

  async updateViewed(id: string, ip: string) {
    console.log('updateViewed', id, ip);
    const exists = await this.redisService.exists(`isViewed::${id}::${ip}`);
    if (!exists) {
      await this.redisService.set(
        `isViewed::${id}::${ip}`,
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
    }
    return true;
  }

  async saveArticle(article: Article) {
    let action = 'update';
    if (!article.id) {
      article.id = this.idGenerate.nextId().toString();
      action = 'add';
    }
    await this.articleModel.save(article);
    await this.rabbitmqService.sendToQueue(`article_${process.env.NODE_ENV}`, {
      id: article.id,
      action,
    });
    this.ctx.logger.info(`mq发送队列${`article_${process.env.NODE_ENV}`}`);
    return article;
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
        doc: {
          ...article,
          createTime: new Date(article.createTime),
          updateTime: new Date(article.updateTime),
          deleteTime: article.deleteTime ? new Date(article.deleteTime) : null,
        },
      });
    } else {
      await elasticsearch.index({
        index: 'blog',
        id: article.id,
        document: {
          ...article,
          createTime: new Date(article.createTime),
          updateTime: new Date(article.updateTime),
          deleteTime: article.deleteTime ? new Date(article.deleteTime) : null,
        },
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
    } catch (e) {
      console.log(e);
    }
    await elasticsearch.indices.create({
      index: 'blog',
    });
    await elasticsearch.indices.putMapping({
      index: 'blog',
      properties: {
        title: {
          type: 'text',
          analyzer: 'smartcn',
          search_analyzer: 'smartcn',
        },
        tag: {
          type: 'text',
          analyzer: 'smartcn',
          search_analyzer: 'smartcn',
        },
        is_release: {
          type: 'short',
        },
        content: {
          type: 'text',
          analyzer: 'smartcn',
          search_analyzer: 'smartcn',
        },
        summary: {
          type: 'text',
          analyzer: 'smartcn',
          search_analyzer: 'smartcn',
        },
      },
    });
    const list = await this.articleModel.find({
      withDeleted: true,
    });
    const operations = list.flatMap(doc => [
      { index: { _index: 'blog', _id: doc.id } },
      {
        title: doc.title,
        tag: doc.tag,
        summary: doc.summary,
        isRelease: doc.isRelease,
        createTime: new Date(doc.createTime),
        updateTime: new Date(doc.updateTime),
        deleteTime: doc.deleteTime ? new Date(doc.deleteTime) : null,
        content: doc.content,
      },
    ]);
    const bulkResponse = await elasticsearch.bulk({
      refresh: true,
      operations,
    });
    if (bulkResponse.errors) {
      const erroredDocuments = [];
      // The items array has the same order of the dataset we just indexed.
      // The presence of the `error` key indicates that the operation
      // that we did for the document has failed.
      bulkResponse.items.forEach((action, i) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            // If the status is 429 it means that you can retry the document,
            // otherwise it's very likely a mapping error, and you should
            // fix the document before to try it again.
            status: action[operation].status,
            error: action[operation].error,
            operation: operations[i * 2],
            document: operations[i * 2 + 1],
          });
        }
      });
      console.log(erroredDocuments);
    }
    return true;
  }
}
