import { Inject, Logger, Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { ILogger } from '@midwayjs/logger';
import { MidwayWebRouterService } from '@midwayjs/core';

// import { AuthService } from '../service/Auth.service';

@Middleware()
export class RouterMiddleware {
  @Inject()
  jwtService: JwtService;

  @Logger()
  logger: ILogger;
  @Inject()
  webRouterService: MidwayWebRouterService;

  public static getName(): string {
    return 'jwt';
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const accessToken = ctx.headers['authorization'];
      if (accessToken) {
        const [scheme, token] = accessToken.trim().split(' ');
        if (/^Bearer$/i.test(scheme)) {
          ctx.state = { user: await this.jwtService.decode(token) };
        }
      }
      await next();
    };
  }
}
