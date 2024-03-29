import { Catch, Logger } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ILogger } from '@midwayjs/logger';

@Catch()
export class DefaultErrorFilter {
  @Logger()
  logger: ILogger;

  async catch(err: Error, ctx: Context) {
    this.logger.error(err.message, ctx);
    console.log(err, ctx);
    return { success: false, code: -1, message: '未知错误', data: null };
  }
}
