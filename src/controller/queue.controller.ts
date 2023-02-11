import { Controller, Get, Inject, Query } from '@midwayjs/decorator';
import * as bull from '@midwayjs/bull';

@Controller('/queue')
export class QueueController {
  @Inject()
  bullFramework: bull.Framework;

  @Get('/manual')
  async home(@Query('name') name: string): Promise<any> {
    const queue = this.bullFramework.getQueue(name);
    return await queue?.runJob({});
  }
}
