import { Controller, Get, Inject, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { RabbitmqService } from '../service/rabbitmq';

@Controller('/track')
export class TrackController {
  @Inject()
  ctx: Context;
  @Inject()
  rabbitmqService: RabbitmqService;

  @Get('/log.gif')
  async home(@Query('q') q: string): Promise<string> {
    await this.rabbitmqService.sendToQueue(`log_${process.env.NODE_ENV}`, {
      q: q,
    });
    this.ctx.response.set('content-type', 'image/gif');
    return 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
  }
}
