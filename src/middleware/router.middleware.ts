import { Inject, Logger, Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { ILogger } from '@midwayjs/logger';
import { httpError, MidwayWebRouterService } from '@midwayjs/core';
import { AuthService } from '../service/Auth.service';

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
      const routeInfo = await this.webRouterService.getMatchedRouterInfo(
        ctx.path,
        ctx.method
      );
      if (!routeInfo) {
        throw new httpError.NotFoundError();
      }
      if (
        routeInfo.middleware.some(item => item.name === 'AnonymousMiddleware')
      ) {
        await next();
      } else {
        // 判断下有没有校验信息
        if (!ctx.headers['authorization']) {
          throw new httpError.UnauthorizedError();
        }
        // 从 header 上获取校验信息
        const parts = ctx.get('authorization').trim().split(' ');

        if (parts.length !== 2) {
          throw new httpError.UnauthorizedError();
        }
        const [scheme, token] = parts;
        if (/^Bearer$/i.test(scheme)) {
          const result: any = await this.jwtService.verify(token);
          const userRoleService = await ctx.requestContext.getAsync(
            AuthService
          );
          const roles = await userRoleService.getRoleByUserId(result.uid);
          if (roles.some(role => ctx.url.startsWith(role))) {
            ctx.state = { user: await this.jwtService.decode(token) };
          } else {
            throw new httpError.ForbiddenError();
          }
          await next();
        } else {
          throw new httpError.UnauthorizedError();
        }
      }
    };
  }
}
