import {Body, Controller, Get, Inject, Post, Queries, Query} from '@midwayjs/decorator';
import {ArticleService} from '../service/Article.service';
import {PageVo} from '../vo/PageVo';
import {Article} from "../entity/Article";
import {ElasticsearchService} from '@midway/elasticsearch';
import {ResultUtil} from "../util/ResultUtil";
import {Anonymous} from "../decorator/Auth.decorator";
import {toHump} from "../util/common";

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
  @Anonymous()
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
    const response = result.body.hits.hits.filter(hit => hit._source.is_release === 1 && hit._source.is_delete === 0).map(hit => {
      let article = new Article()
      article.id = hit._id
      for (let [key, value] of Object.entries(hit._source)) {
        article[toHump(key)] = value
      }
      for (let [key, value] of Object.entries(hit.highlight as Record<string, string[]>)) {
        if (value.length) {
          article[toHump(key)] = value.join(' ')
        }
      }
      return article
    })
    return ResultUtil.success(response);
  }
}
