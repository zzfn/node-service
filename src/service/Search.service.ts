import { Inject, Provide } from '@midwayjs/decorator';
import { ElasticsearchServiceFactory } from '@oc/midway-es';
import { getUserIp } from '../util/httpUtil';
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
      body: {
        ...JSON.parse(Buffer.from(body, 'base64').toString('ascii')),
        ip: getUserIp(this.ctx),
        time: new Date(),
      },
    });
  }
}
