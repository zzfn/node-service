import {Controller, Get, Inject, Queries, Query} from '@midwayjs/decorator';
import {Article} from "../entity/Article";
import {ElasticsearchService} from '@midway/elasticsearch';
import {ResultUtil} from "../util/ResultUtil";
import {Anonymous} from "../decorator/Auth.decorator";
import {toHump} from "../util/common";
import {PageVo} from "../vo/PageVo";
import {page2sql} from "../vo/page2sql";
import * as dayjs from 'dayjs'
@Controller('/search')
export class APIController {

  @Inject()
  elasticsearchService: ElasticsearchService;

  @Get('/article')
  @Anonymous()
  async searchArticle(@Query("keyword") keyword: string) {
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

  @Get('/log')
  @Anonymous()
  async searchLog(@Query("keyword") keyword: string, @Queries() pageVo: PageVo) {
    const {skip, take} = page2sql(pageVo)
    const result = await this.elasticsearchService.search({
      index: 'log-performance',
      body: {
        query: {
          match_all: {}
        },
        "from": skip,
        "size": take,
        "sort": [
          {
            "time": {
              "order": "desc"
            }
          }
        ]
      }
    })
    const response = {
      records: result.body.hits.hits.map(hit =>(
        {
          id:hit._id,
          ...hit._source,
          time:dayjs(hit._source.time).format("YYYY/MM/DD HH:mm:ss"),
        }
      )),
      total: result.body.hits.total.value,
    };
    return ResultUtil.success(response);
  }
}
