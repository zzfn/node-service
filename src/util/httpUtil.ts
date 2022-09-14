import { Context } from '@midwayjs/koa';

export function getUserIp(ctx: Context): string {
  const ip = (ctx.headers['x-forwarded-for'] as string) || ctx.request.ip;
  return ip === '::1' ? '127.0.0.1' : ip;
}
