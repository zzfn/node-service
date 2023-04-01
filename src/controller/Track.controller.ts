import { Controller, Get, Inject, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { RabbitmqService } from '../service/rabbitmq';
import { getUserIp } from '../util/httpUtil';
import { ElasticsearchServiceFactory } from '@oc/midway-es';

@Controller('/track')
export class TrackController {
  @Inject()
  ctx: Context;
  @Inject()
  rabbitmqService: RabbitmqService;
  @Inject()
  elasticsearchService: ElasticsearchServiceFactory;

  @Get('/log.gif')
  async home(@Query('q') q: string): Promise<Buffer> {
    await this.rabbitmqService.sendToQueue(`log_${process.env.NODE_ENV}`, {
      ...JSON.parse(Buffer.from(q, 'base64').toString('ascii')),
      ip: getUserIp(this.ctx),
      time: new Date(),
    });
    this.ctx.response.set('content-type', 'image/gif');
    const base64Str = 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    return Buffer.from(base64Str, 'base64');
  }

  @Get('/reset')
  async reset(): Promise<boolean> {
    const elasticsearch = this.elasticsearchService.get();
    try {
      await elasticsearch.indices.delete({
        index: 'log-performance',
      });
    } catch (error) {}
    await elasticsearch.indices.create({
      index: 'log-performance',
    });
    await elasticsearch.indices.putMapping({
      index: 'log-performance',
      properties: {
        url: {
          type: 'keyword',
        },
        visitorId: {
          type: 'keyword',
        },
        browser: {
          type: 'keyword',
        },
        browserVersion: {
          type: 'keyword',
        },
        os: {
          type: 'keyword',
        },
        osVersion: {
          type: 'keyword',
        },
        referrer: {
          type: 'keyword',
        },
        screen: {
          type: 'keyword',
        },
        ua: {
          type: 'keyword',
        },
        name: {
          type: 'keyword',
        },
        value: {
          type: 'keyword',
        },
      },
    });
    return true;
  }
}
