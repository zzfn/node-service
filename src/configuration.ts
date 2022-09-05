import {
  Configuration,
  App,
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
import * as passport from '@midwayjs/passport';
import * as jwt from '@midwayjs/jwt';
import { ReportMiddleware } from './middleware/report.middleware';
import { NotFoundFilter } from './filter/notfound.filter';
import { DefaultErrorFilter } from './filter/default.filter';
import { UnauthorizedFilter } from './filter/unauthorized.filter';
import { ForbiddenFilter } from './filter/forbidden.filter';
import { RouterMiddleware } from './middleware/router.middleware';
import { FormatMiddleware } from './middleware/FormatMiddleware';
import * as crossDomain from '@midwayjs/cross-domain';
import * as elasticsearch from '@midway/elasticsearch';
import * as cache from '@midwayjs/cache';
import * as dotenv from 'dotenv';
import * as upload from '@midwayjs/upload';
import * as oss from '@midwayjs/oss';
import * as redis from '@midwayjs/redis';
import * as rabbitmq from '@midwayjs/rabbitmq';
import * as prometheus from '@midwayjs/prometheus';
import { CustomFilter } from './filter/Custom.filter';
import { MidwayDecoratorService } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';

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
    passport,
    crossDomain,
    elasticsearch,
    cache,
    upload,
    oss,
    redis,
    rabbitmq,
    prometheus,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;
  @Inject()
  decoratorService: MidwayDecoratorService;
  @Logger()
  logger;
  @Inject()
  redisService: RedisService;

  async onReady() {
    // add middleware
    this.app.useMiddleware([
      ReportMiddleware,
      RouterMiddleware,
      FormatMiddleware,
    ]);
    // add filter
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
  }
}
