import { IMiddleware } from '@midwayjs/core';
import { Inject, Middleware } from '@midwayjs/decorator';
import { NextFunction, Context } from '@midwayjs/koa';
import { SnowflakeIdGenerate } from '../service/Snowflake';

@Middleware()
export class ReportMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  idGenerate: SnowflakeIdGenerate;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 控制器前执行的逻辑
      const startTime = Date.now();
      // 执行下一个 Web 中间件，最后执行到控制器
      // 这里可以拿到下一个中间件或者控制器的返回值
      const result = await next();
      const traceId = this.idGenerate.nextId().toString();
      ctx.res.setHeader('traceId', traceId);
      // 控制器之后执行的逻辑
      ctx.logger.info(
        `url = ${ctx.request.url}, traceId = ${traceId}, rt = ${
          Date.now() - startTime
        }ms,ip = ${ctx.headers['x-forwarded-for'] || ctx.request.ip}`
      );
      // 返回给上一个中间件的结果
      return result;
    };
  }

  static getName(): string {
    return 'report';
  }
}
