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

  @Get('/sortByField')
  async sortByField(@Query('field') field: string) {
    return await this.articleService.sortByField(field);
  }

  @Get('/lastCreated')
  async lastCreated() {
    return await this.articleService.lastCreated();
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
  async articlePage(
    @Queries() pageVo: PageVo,
    @Query('id') id: string,
    @Query('isRelease') isRelease: string
  ) {
    return await this.articleService.pageArticle(pageVo, id, isRelease);
  }

  @Get('/getOne')
  async articleOne(@Query('id') id: string) {
    return await this.articleService.getById(id);
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
