import { Inject, Provide } from '@midwayjs/decorator';
import { ElasticsearchServiceFactory } from '@oc/midway-es';

@Provide()
export class SearchService {
  @Inject()
  elasticsearchService: ElasticsearchServiceFactory;

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
}
