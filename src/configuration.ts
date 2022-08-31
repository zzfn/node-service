import { Configuration, App } from '@midwayjs/decorator';
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
import { AuthMiddleware } from './middleware/auth.middleware';
import { FormatMiddleware } from './middleware/FormatMiddleware';
import * as crossDomain from '@midwayjs/cross-domain';
import * as elasticsearch from '@midway/elasticsearch';
import * as cache from '@midwayjs/cache';
import * as dotenv from 'dotenv';
import * as upload from '@midwayjs/upload';
import * as oss from '@midwayjs/oss';
import * as redis from '@midwayjs/redis';
import * as rabbitmq from '@midwayjs/rabbitmq';
import { CustomFilter } from './filter/Custom.filter';

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
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([
      ReportMiddleware,
      AuthMiddleware,
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
  }
}
