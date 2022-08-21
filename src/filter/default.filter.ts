import { Catch, Logger } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ResultUtil } from '../util/ResultUtil';
import { ILogger } from '@midwayjs/logger';

@Catch()
export class DefaultErrorFilter {
  @Logger()
  logger: ILogger;
  async catch(err: Error, ctx: Context) {
    this.logger.error(err.message, ctx);
    return ResultUtil.error(err.message);
  }
}
