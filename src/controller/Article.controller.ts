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

  @Get('/count', { middleware: [AnonymousMiddleware] })
  async articleCount() {
    return await this.articleService.articleCount();
  }

  @Get('/lastUpdated', { middleware: [AnonymousMiddleware] })
  async lastUpdated() {
    return await this.articleService.lastUpdated();
  }

  @Get('/tags', { middleware: [AnonymousMiddleware] })
  async tags() {
    return await this.articleService.articleTags();
  }

  @Get('/list', { middleware: [AnonymousMiddleware] })
  async articleList(@Query('code') code: string) {
    return await this.articleService.articleList(code);
  }

  @Get('/page', { middleware: [AnonymousMiddleware] })
  async articlePage(@Queries() pageVo: PageVo, id: string) {
    return await this.articleService.pageArticle(pageVo, id);
  }

  @Get('/getOne', { middleware: [AnonymousMiddleware] })
  async articleOne(@Query('id') id: string) {
    return await this.articleService.getArticle(id);
  }

  @Post('/updateViewed', { middleware: [AnonymousMiddleware] })
  async articleOne1(@Query('id') id: string) {
    return await this.articleService.getArticle(id);
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
