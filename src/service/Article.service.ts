import { Inject, Logger, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Article } from '../entity/Article';
import { PageVo } from '../vo/PageVo';
import { ILogger } from '@midwayjs/logger';
import { page2sql } from '../vo/page2sql';
import { BaseService } from './BaseService';
import { Repository } from 'typeorm';
import { ElasticsearchService } from '@midway/elasticsearch';

@Provide()
export class ArticleService extends BaseService<Article> {
  @InjectEntityModel(Article)
  articleModel;
  @Inject()
  elasticsearchService: ElasticsearchService;

  getModel(): Repository<Article> {
    return this.articleModel;
  }

  @Logger()
  logger: ILogger;

  async getArticle(pageVo: PageVo, id: string = '') {
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
    return await this.articleModel.save(article);
  }

  async db2es(id: string) {
    const article = await this.articleModel.findOneBy({ id });
    this.elasticsearchService.update({
      index: 'blog',
      id: article.id,
      body: { doc: article },
    });
  }
}
