import {
  Body,
  Controller,
  Del,
  Get,
  Inject,
  Param,
  Post,
  Queries,
  Query,
} from '@midwayjs/decorator';
import { ArticleService } from '../service/Article.service';
import { PageVo } from '../vo/PageVo';
import { Article } from '../entity/Article';
import { Authorize } from '../decorator/Authorize';

@Controller('/article')
export class ArticleController {
  @Inject()
  articleService: ArticleService;

  @Get('/count')
  async articleCount() {
    return await this.articleService.articleCount();
  }

  @Get('/aside')
  async articleAside() {
    return await this.articleService.articleAside();
  }

  @Get('/lastUpdated')
  async lastUpdated() {
    return await this.articleService.lastUpdated();
  }

  @Get('/tags')
  async tags() {
    return await this.articleService.articleTags();
  }

  @Get('/list')
  async articleList(@Query('code') code: string) {
    return await this.articleService.articleList(code);
  }

  @Get('/page')
  async articlePage(@Queries() pageVo: PageVo, @Query('id') id: string) {
    return await this.articleService.pageArticle(pageVo, id);
  }

  @Get('/getOne')
  async articleOne(@Query('id') id: string) {
    return await this.articleService.getArticle(id);
  }

  @Post('/updateViewed')
  async updateViewed(@Query('id') id: string) {
    return await this.articleService.updateViewed(id);
  }

  @Post('/save')
  @Authorize(true)
  async saveArticle(@Body() article: Article) {
    const result = await this.articleService.saveArticle(article);
    return result.id;
  }

  @Get('/topSearch')
  async topSearch() {
    return await this.articleService.topSearch();
  }

  @Post('/resetElastic')
  @Authorize(true)
  async resetElastic() {
    return await this.articleService.resetEs();
  }

  @Del('/:id')
  async deleteArticle(@Param('id') id: string) {
    return await this.articleService.deleteArticle(id);
  }
}
