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
import { AuthMiddleware } from './middleware/auth.middleware';
import * as swagger from '@midwayjs/swagger';
import * as crossDomain from '@midwayjs/cross-domain';
import * as elasticsearch from '@midway/elasticsearch';
import * as cache from '@midwayjs/cache';

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
    swagger,
    crossDomain,
    elasticsearch,
    cache
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware,AuthMiddleware]);
    // add filter
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
