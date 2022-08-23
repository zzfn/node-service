import { Logger, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Article } from '../entity/Article';
import { PageVo } from '../vo/PageVo';
import { ILogger } from '@midwayjs/logger';
import { page2sql } from '../vo/page2sql';

@Provide()
export class ArticleService {
  @InjectEntityModel(Article)
  articleModel;
  @Logger()
  logger: ILogger;

  async getArticle(pageVo: PageVo) {
    const response = {
      records: await this.articleModel.find({
        ...page2sql(pageVo),
      }),
      total: await this.articleModel.count(),
    };
    return response;
  }

  async saveArticle(article: Article) {
    return await this.articleModel.save(article);
  }
}
