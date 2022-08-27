import { Controller, Get, Inject, Queries, Query } from '@midwayjs/decorator';
import { Article } from '../entity/Article';
import { ElasticsearchService } from '@midway/elasticsearch';
import { Anonymous } from '../decorator/Auth.decorator';
import { toHump } from '../util/common';
import { PageVo } from '../vo/PageVo';
import { page2sql } from '../vo/page2sql';
import * as dayjs from 'dayjs';
import { RedisService } from '@midwayjs/redis';

@Controller('/search')
export class APIController {
  @Inject()
  elasticsearchService: ElasticsearchService;
  @Inject()
  redisService: RedisService;

  @Get('/article')
  @Anonymous()
  async searchArticle(@Query('keyword') keyword: string) {
    this.redisService.zadd('searchKeywords', 'INCR', 1, `"${keyword}"`);
    const result = await this.elasticsearchService.search({
      index: 'blog',
      body: {
        query: {
          bool: {
            should: [
              { match_phrase: { content: keyword } },
              { match_phrase: { title: keyword } },
              { match_phrase: { tag_desc: keyword } },
            ],
          },
        },
        highlight: {
          fields: {
            content: {},
            title: {},
            tag_desc: {},
          },
        },
      },
    });
    return result.body.hits.hits
      .filter(
        hit => hit._source.is_release === 1 && hit._source.is_delete === 0
      )
      .map(hit => {
        const article = new Article();
        article.id = hit._id;
        for (const [key, value] of Object.entries(hit._source)) {
          article[toHump(key)] = value;
        }
        for (const [key, value] of Object.entries(
          hit.highlight as Record<string, string[]>
        )) {
          if (value.length) {
            article[toHump(key)] = value.join(' ');
          }
        }
        return article;
      });
  }

  @Get('/log')
  @Anonymous()
  async searchLog(
    @Query('keyword') keyword: string,
    @Queries() pageVo: PageVo
  ) {
    const { skip, take } = page2sql(pageVo);
    const result = await this.elasticsearchService.search({
      index: 'log-performance',
      body: {
        query: {
          match_all: {},
        },
        from: skip,
        size: take,
        sort: [
          {
            time: {
              order: 'desc',
            },
          },
        ],
      },
    });
    return {
      records: result.body.hits.hits.map(hit => ({
        id: hit._id,
        ...hit._source,
        time: dayjs(hit._source.time).format('YYYY/MM/DD HH:mm:ss'),
      })),
      total: result.body.hits.total.value,
    };
  }

  @Get('/log/user')
  @Anonymous()
  async logUser() {
    const result = await this.elasticsearchService.search({
      index: 'log-performance',
      body: {
        query: {
          bool: {
            should: [
              { term: { name: 'Next.js-render' } },
              { term: { name: 'Next.js-hydration' } },
            ],
          },
        },
        aggs: {
          records: {
            date_histogram: {
              field: 'time',
              interval: 'day',
              format: 'yyyy-MM-dd',
              time_zone: '+08:00',
            },
            aggs: {
              uv: {
                cardinality: {
                  field: 'visitorId',
                },
              },
            },
          },
        },
      },
    });
    console.log(result.body.aggregations.records.buckets);
    return result.body.aggregations.records.buckets.map(item => ({
      key: item.key_as_string,
      pv: item.doc_count,
      uv: item.uv.value,
      name: item.key_as_string,
    }));
  }
}
