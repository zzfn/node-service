import { Inject, Provide } from '@midwayjs/decorator';
import { ElasticsearchServiceFactory } from '@oc/midway-es';
import { Context } from '@midwayjs/koa';

@Provide()
export class SearchService {
  @Inject()
  elasticsearchService: ElasticsearchServiceFactory;
  @Inject()
  ctx: Context;

  async deleteOverMonth(): Promise<any> {
    const elasticsearch = this.elasticsearchService.get();
    return elasticsearch.deleteByQuery({
      index: 'log-performance',
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
    });
  }

  async save(body: any) {
    const elasticsearch = this.elasticsearchService.get();
    elasticsearch.index({
      index: 'log-performance',
      body,
    });
  }
}
