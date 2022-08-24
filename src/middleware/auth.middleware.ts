import { Inject, Logger, Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';
import { httpError } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';
import { ILogger } from '@midwayjs/logger';
import { AuthService } from '../service/Auth.service';

@Middleware()
export class AuthMiddleware {
  @Inject()
  jwtService: JwtService;

  @Logger()
  logger: ILogger;

  public static getName(): string {
    return 'jwt';
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
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
        this.logger.info(result);
        const userRoleService = await ctx.requestContext.getAsync(AuthService);
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
    };
  }

  // 配置忽略鉴权的路由地址
  public ignore(ctx: Context): boolean {
    return ['/user/login', '/user/register', '/search/article'].some(item =>
      ctx.path.includes(item)
    );
  }
}
