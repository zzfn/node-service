import { Config, Inject, Logger, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Article } from '../entity/Article';
import { PageVo } from '../vo/PageVo';
import { ILogger } from '@midwayjs/logger';
import { BaseService } from './BaseService';
import { Repository } from 'typeorm';
import { ElasticsearchServiceFactory } from '@midway/elasticsearch';
import { SnowflakeIdGenerate } from './Snowflake';
import { RabbitmqService } from './rabbitmq';
import { page2sql } from '../vo/page2sql';
import { RedisService } from '@midwayjs/redis';
import { DictionaryService } from './Dictionary.service';

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
  @Inject()
  dictionaryService: DictionaryService;

  getModel(): Repository<Article> {
    return this.articleModel;
  }

  @Logger()
  logger: ILogger;

  async pageArticle(pageVo: PageVo, id = '') {
    const [records, total] = await this.articleModel.findAndCount({
      ...page2sql(pageVo),
      relations: { tag: true },
      order: {
        orderNum: 'DESC',
        createTime: 'DESC',
      },
    });
    return { records, total };
  }

  async lastUpdated() {
    return this.articleModel.find({
      order: {
        updateTime: 'DESC',
      },
      take: 5,
    });
  }

  async articleCount() {
    const r = await this.articleModel
      .createQueryBuilder('article')
      .groupBy('article.tagId')
      .getMany();
    return {
      article: await this.articleModel.count({}),
      tag: r.length,
    };
  }

  async articleList(code: string) {
    let where = {};
    if (code) {
      where = { tagId: code };
    }
    const dictionary = await this.dictionaryService.list(code);
    return {
      title: dictionary.name,
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
      .leftJoin('article.tag', 'tag')
      .addSelect('tag.name', 'tag')
      .addSelect('article.tagId', 'code')
      .groupBy('article.tagId')
      .printSql()
      .getRawMany();
  }

  async getArticle(id: string) {
    const article = await this.articleModel.findOne({
      where: {
        id,
      },
      relations: { tag: true },
    });
    article.viewCount = await this.redisService.zscore('viewCount', id);
    return article;
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
      relations: { tag: true },
      withDeleted: true,
    });
    console.log(list.length);
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
