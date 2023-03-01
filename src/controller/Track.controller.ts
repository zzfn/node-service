import { Controller, Get, Inject, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { RabbitmqService } from '../service/rabbitmq';
import { getUserIp } from '../util/httpUtil';

@Controller('/track')
export class TrackController {
  @Inject()
  ctx: Context;
  @Inject()
  rabbitmqService: RabbitmqService;

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
}
