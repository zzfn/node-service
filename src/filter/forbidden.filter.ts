import { Catch } from '@midwayjs/decorator';
import { httpError, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch(httpError.ForbiddenError)
export class ForbiddenFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    ctx.status = err.status;
    return {
      success: false,
      code: err.status,
      message: err.message,
      data: null,
    };
  }
}
