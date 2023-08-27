import { IMiddleware, Middleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';

@Middleware()
export class FormatMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const result = await next();
      return { success: true, code: 0, message: 'OK', data: result };
    };
  }

  ignore(ctx: Context): boolean {
    return ctx.path.startsWith('/track/log');
  }
}
