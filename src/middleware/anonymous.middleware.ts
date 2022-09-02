import { Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';

@Middleware()
export class AnonymousMiddleware {
  public static getName(): string {
    return 'jwt';
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      await next();
    };
  }
}
