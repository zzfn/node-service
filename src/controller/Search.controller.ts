import { Controller, Get, Inject, Queries, Query } from '@midwayjs/decorator';
import { Article } from '../entity/Article';
import { ElasticsearchServiceFactory } from '@midway/elasticsearch';
import { toHump } from '../util/common';
import { PageVo } from '../vo/PageVo';
import { page2sql } from '../vo/page2sql';
import * as dayjs from 'dayjs';
import { RedisService } from '@midwayjs/redis';
import { SearchVo } from '../vo/searchVo';

@Controller('/search')
export class APIController {
  @Inject()
  elasticsearchService: ElasticsearchServiceFactory;
  @Inject()
  redisService: RedisService;

  @Get('/article')
  async searchArticle(@Query('keyword') keyword: string) {
    if (!keyword) {
      return [];
    }
    const elasticsearch = this.elasticsearchService.get();
    this.redisService.zadd('searchKeywords', 'INCR', 1, keyword);
    const result = await elasticsearch.search({
      index: 'blog',
      body: {
        query: {
          bool: {
            should: [
              { match_phrase: { content: keyword } },
              { match_phrase: { title: keyword } },
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
        hit => hit._source.isRelease === true && hit._source.deleteTime === null
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
      })
      .filter(article => article.isRelease && !article.deleteTime);
  }

  @Get('/log')
  async searchLog(
    @Query('keyword') keyword: string,
    @Queries() pageVo: PageVo,
    @Queries() searchVo: SearchVo
  ) {
    console.log(
      Object.entries(searchVo)
        .filter(
          ([key, value]) => value && !['current', 'pageSize'].includes(key)
        )
        .map(([key, value]) => ({
          match_phrase: { [key]: value },
        }))
    );
    const { skip, take } = page2sql(pageVo);
    const elasticsearch = this.elasticsearchService.get();
    const result = await elasticsearch.search({
      index: 'log-performance',
      body: {
        query: {
          bool: {
            should: Object.entries(searchVo)
              .filter(
                ([key, value]) =>
                  value && !['current', 'pageSize'].includes(key)
              )
              .map(([key, value]) => ({
                match_phrase: { [key]: value },
              })),
          },
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
  async logUser() {
    const elasticsearch = this.elasticsearchService.get();
    const result = await elasticsearch.search({
      index: 'log-performance',
      body: {
        query: {
          bool: {
            must: [
              {
                range: {
                  time: {
                    gte: 'now-15d/d',
                  },
                },
              },
            ],
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
    return result.body.aggregations.records.buckets.map(item => ({
      key: item.key_as_string,
      pv: item.doc_count,
      uv: item.uv.value,
      name: item.key_as_string,
    }));
  }
}
