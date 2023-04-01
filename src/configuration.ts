import {
  App,
  Configuration,
  Inject,
  JoinPoint,
  Logger,
} from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import * as orm from '@midwayjs/typeorm';
import * as task from '@midwayjs/task';
import * as jwt from '@midwayjs/jwt';
import { JwtService } from '@midwayjs/jwt';
import { ReportMiddleware } from './middleware/report.middleware';
import { NotFoundFilter } from './filter/notfound.filter';
import { DefaultErrorFilter } from './filter/default.filter';
import { UnauthorizedFilter } from './filter/unauthorized.filter';
import { ForbiddenFilter } from './filter/forbidden.filter';
import { RouterMiddleware } from './middleware/router.middleware';
import { FormatMiddleware } from './middleware/FormatMiddleware';
import * as crossDomain from '@midwayjs/cross-domain';
import * as elasticsearch from '@oc/midway-es';
import * as cache from '@midwayjs/cache';
import * as dotenv from 'dotenv';
import * as upload from '@midwayjs/upload';
import * as oss from '@midwayjs/oss';
import * as redis from '@midwayjs/redis';
import { RedisService } from '@midwayjs/redis';
import * as rabbitmq from '@midwayjs/rabbitmq';
import * as prometheus from '@midwayjs/prometheus';
import * as bull from '@midwayjs/bull';
import { CustomFilter } from './filter/Custom.filter';
import { httpError, MidwayDecoratorService } from '@midwayjs/core';
import { REQUEST_OBJ_CTX_KEY } from '@midwayjs/core';
import * as kafka from '@midwayjs/kafka';

dotenv.config();

@Configuration({
  imports: [
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    orm,
    task,
    jwt,
    crossDomain,
    elasticsearch,
    cache,
    upload,
    oss,
    redis,
    rabbitmq,
    prometheus,
    bull,
    kafka,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;
  @Inject()
  decoratorService: MidwayDecoratorService;
  @Inject()
  jwtService: JwtService;
  @Logger()
  logger;
  @Inject()
  redisService: RedisService;

  async onReady() {
    this.app.useMiddleware([
      ReportMiddleware,
      RouterMiddleware,
      FormatMiddleware,
    ]);
    this.app.useFilter([
      DefaultErrorFilter,
      UnauthorizedFilter,
      ForbiddenFilter,
      NotFoundFilter,
      CustomFilter,
    ]);

    this.decoratorService.registerMethodHandler('Cacheable', options => {
      return {
        around: async (joinPoint: JoinPoint) => {
          const cacheName = options.metadata.cacheName || joinPoint.methodName;
          const cache = await this.redisService.get(cacheName);
          if (cache) {
            return JSON.parse(cache);
          } else {
            const result = await joinPoint.proceed(...joinPoint.args);
            await this.redisService.set(
              cacheName,
              JSON.stringify(result),
              'EX',
              60 * 60
            );
            return result;
          }
        },
      };
    });
    this.decoratorService.registerMethodHandler('Authorize', options => {
      return {
        around: async (joinPoint: JoinPoint) => {
          const instance = joinPoint.target;
          const ctx = instance[REQUEST_OBJ_CTX_KEY];
          if (!ctx.headers['authorization']) {
            throw new httpError.UnauthorizedError();
          }
          const parts = ctx.headers['authorization'].trim().split(' ');
          if (parts.length !== 2) {
            throw new httpError.UnauthorizedError();
          }
          const [scheme, token] = parts;
          if (/^Bearer$/i.test(scheme)) {
            try {
              const verifyResult: any = await this.jwtService.verify(token);
              if (options.metadata.onlyAdmin) {
                if (verifyResult.isAdmin) {
                  return await joinPoint.proceed(...joinPoint.args);
                } else {
                  return Promise.reject(new httpError.ForbiddenError());
                }
              } else {
                return await joinPoint.proceed(...joinPoint.args);
              }
            } catch (e) {
              throw new httpError.UnauthorizedError();
            }
          } else {
            throw new httpError.UnauthorizedError();
          }
        },
      };
    });
  }
}
