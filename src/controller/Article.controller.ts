import {Body, Controller, Get, Inject, Post, Queries, Query} from '@midwayjs/decorator';
import {ArticleService} from '../service/Article.service';
import {PageVo} from '../vo/PageVo';
import {Article} from "../entity/Article";
import {ElasticsearchService} from '@midway/elasticsearch';
import {ResultUtil} from "../util/ResultUtil";

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

  @Get('/search')
  async es(@Query("keyword") keyword: string) {
    const result = await this.elasticsearchService.search({
      index: 'blog',
      body: {
        query: {
          bool: {
            should: [
              {match_phrase: {content: keyword}},
              {match_phrase: {title: keyword}},
              {match_phrase: {tag_desc: keyword}},
            ]
          }
        },
        highlight: {
          fields: {
            content: {},
            title: {},
            tag_desc: {},
          }
        }
      }
    })
    const response = result.body.hits.hits.filter(hit=>hit._source.is_release===1&&hit._source.is_delete===0).map(hit =>
      Object.entries(hit.highlight as Record<string, string[]>).reduce((prev, curr) => {
        if (curr[1].length) {
          prev[curr[0]] = curr[1].join(" ")
        }
        return prev
      }, {})
    )
    return ResultUtil.success(response);
  }
}
