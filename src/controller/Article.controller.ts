import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Queries,
  Query,
} from '@midwayjs/decorator';
import { ArticleService } from '../service/Article.service';
import { PageVo } from '../vo/PageVo';
import { Article } from '../entity/Article';
import { AnonymousMiddleware } from '../middleware/anonymous.middleware';

@Controller('/article')
export class ArticleController {
  @Inject()
  articleService: ArticleService;

  @Get('/list')
  async articleList(@Queries() pageVo: PageVo, id: string) {
    return await this.articleService.getArticle(pageVo, id);
  }

  @Get('/page', { middleware: [AnonymousMiddleware] })
  async articlePage(@Queries() pageVo: PageVo, id: string) {
    return await this.articleService.page({}, pageVo.current, pageVo.pageSize);
  }

  @Get('/getOne')
  async articleOne(@Query('id') id: string) {
    return await this.articleService.getOne(id);
  }

  @Post('/save')
  async saveArticle(@Body() article: Article) {
    const result = await this.articleService.saveArticle(article);
    return result.id;
  }

  @Post('/resetEs')
  async resetEs() {
    return await this.articleService.resetEs();
  }
}
