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
import { Authorize } from '../decorator/Authorize';

@Controller('/article')
export class ArticleController {
  @Inject()
  articleService: ArticleService;

  @Get('/count', { middleware: [AnonymousMiddleware] })
  async articleCount() {
    return await this.articleService.articleCount();
  }

  @Get('/aside', { middleware: [AnonymousMiddleware] })
  async articleAside() {
    return await this.articleService.articleAside();
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
  async articlePage(@Queries() pageVo: PageVo, @Query('id') id: string) {
    return await this.articleService.pageArticle(pageVo, id);
  }

  @Get('/getOne', { middleware: [AnonymousMiddleware] })
  async articleOne(@Query('id') id: string) {
    return await this.articleService.getArticle(id);
  }

  @Post('/updateViewed', { middleware: [AnonymousMiddleware] })
  async updateViewed(@Query('id') id: string) {
    return await this.articleService.updateViewed(id);
  }

  @Post('/save')
  @Authorize()
  async saveArticle(@Body() article: Article) {
    const result = await this.articleService.saveArticle(article);
    return result.id;
  }

  @Get('/topSearch', { middleware: [AnonymousMiddleware] })
  async topSearch() {
    return await this.articleService.topSearch();
  }

  @Post('/resetElastic')
  async resetElastic() {
    return await this.articleService.resetEs();
  }
}
