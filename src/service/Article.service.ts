import { Config, Inject, Logger, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Article } from '../entity/Article';
import { PageVo } from '../vo/PageVo';
import { ILogger } from '@midwayjs/logger';
import { page2sql } from '../vo/page2sql';
import { BaseService } from './BaseService';
import { Repository } from 'typeorm';
import { ElasticsearchServiceFactory } from '@midway/elasticsearch';
import { SnowflakeIdGenerate } from './Snowflake';
import { RabbitmqService } from './rabbitmq';

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

  getModel(): Repository<Article> {
    return this.articleModel;
  }

  @Logger()
  logger: ILogger;

  async getArticle(pageVo: PageVo, id = '') {
    return {
      records: await this.articleModel.find({
        ...page2sql(pageVo),
        where: {
          id,
        },
      }),
      total: await this.articleModel.count({ where: { id } }),
    };
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
          id: {
            type: 'long',
          },
          title: {
            type: 'text',
            analyzer: 'ik_max_word',
            search_analyzer: 'ik_smart',
          },
          tag: {
            type: 'keyword',
          },
          tag_desc: {
            type: 'text',
            analyzer: 'ik_max_word',
            search_analyzer: 'ik_smart',
          },
          is_delete: {
            type: 'short',
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
    const list = await this.articleModel.find({});
    await elasticsearch.bulk({
      body: list.flatMap(doc => [
        { index: { _index: 'blog', _id: doc.id } },
        doc,
      ]),
    });
    return '';
  }
}
