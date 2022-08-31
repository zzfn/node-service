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
import { RabbitmqService } from '../service/rabbitmq';

@Controller('/article')
export class ArticleController {
  @Inject()
  articleService: ArticleService;
  @Inject()
  rabbitmqService: RabbitmqService;

  @Get('/list')
  async articleList(@Queries() pageVo: PageVo, id: string) {
    return await this.articleService.getArticle(pageVo, id);
  }

  @Get('/page')
  async articlePage(@Queries() pageVo: PageVo, id: string) {
    return await this.articleService.page({}, pageVo.current, pageVo.pageSize);
  }

  @Get('/getOne')
  async articleOne(@Query('id') id: string) {
    return await this.articleService.getOne(id);
  }

  @Post('/save')
  async saveArticle(@Body() article: Article) {
    const r = await this.articleService.saveArticle(article);
    await this.rabbitmqService.sendToQueue('local', {
      hello: 'world',
    });
    return r.id;
    // return await this.articleService.saveArticle(article);
  }
}
