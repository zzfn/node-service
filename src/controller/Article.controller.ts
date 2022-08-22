import {Body, Controller, Get, Inject, Post, Queries, Query} from '@midwayjs/decorator';
import {ArticleService} from '../service/Article.service';
import {PageVo} from '../vo/PageVo';
import {Article} from "../entity/Article";
import {ElasticsearchService} from '@midway/elasticsearch';

@Controller('/article')
export class APIController {
  @Inject()
  articleService: ArticleService;

  @Inject()
  elasticsearchService: ElasticsearchService;

  @Get('/list')
  async saveUser(@Queries() pageVo: PageVo) {
    return await this.articleService.getArticle(pageVo);
  }

  @Post('/save')
  async saveArticle(@Body() article: Article) {
    return await this.articleService.saveArticle(article);
  }

  @Get('/es')
  async es(@Query("keyword") keyword: string) {
    const result = await this.elasticsearchService.search({
      index: 'blog',
      body: {
        query: {
          bool:
            {must: [{match: {content: keyword}}]}
        },
        highlight: {
          fields : {
            content : {}
          }
        }
      }
    })
    return result.body;
  }
}
