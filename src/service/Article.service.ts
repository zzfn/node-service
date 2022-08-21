import { Logger, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Article } from '../entity/Article';
import { PageVo } from '../vo/PageVo';
import { ILogger } from '@midwayjs/logger';
import { page2sql } from '../vo/page2sql';
import { ResultUtil } from '../util/ResultUtil';

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
        where: { isDelete: 0 },
      }),
      total: await this.articleModel.countBy({ isDelete: 0 }),
    };
    return ResultUtil.success(response);
  }
}
