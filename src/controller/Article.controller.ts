import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Queries,
} from '@midwayjs/decorator';
import { ArticleService } from '../service/Article.service';
import { PageVo } from '../vo/PageVo';
import { Article } from '../entity/Article';
import { RabbitmqService } from '../service/rabbitmq';

@Controller('/article')
export class APIController {
  @Inject()
  articleService: ArticleService;
  @Inject()
  rabbitmqService: RabbitmqService;

  @Get('/list')
  async saveUser(@Queries() pageVo: PageVo) {
    return await this.articleService.getArticle(pageVo);
  }

  @Post('/save')
  async saveArticle(@Body() article: Article) {
    const r = await this.rabbitmqService.sendToQueue('local', {
      hello: 'world',
    });
    return r;
    // return await this.articleService.saveArticle(article);
  }
}
