import { Inject, Provide } from '@midwayjs/decorator';
import { ElasticsearchServiceFactory } from '@oc/midway-es';
import { Context } from '@midwayjs/koa';

@Provide()
export class SearchService {
  @Inject()
  elasticsearchService: ElasticsearchServiceFactory;
  @Inject()
  ctx: Context;

  async delete30d() {
    const elasticsearch = this.elasticsearchService.get();
    const result = await elasticsearch.deleteByQuery({
      index: 'log-performance',
      body: {
        query: {
          bool: {
            must: [
              {
                range: {
                  time: {
                    lt: 'now-30d/d',
                  },
                },
              },
            ],
          },
        },
      },
    });
    return result.body.deleted;
  }

  async save(body: any) {
    const elasticsearch = this.elasticsearchService.get();
    elasticsearch.index({
      index: 'log-performance',
      body,
    });
  }
}
