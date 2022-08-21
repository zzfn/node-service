import { Controller, Get, Inject, Queries } from '@midwayjs/decorator';
import { ArticleService } from '../service/Article.service';
import { PageVo } from '../vo/PageVo';

@Controller('/article')
export class APIController {
  @Inject()
  articleService: ArticleService;

  @Get('/list')
  async saveUser(@Queries() pageVo: PageVo) {
    return await this.articleService.getArticle(pageVo);
  }
}
