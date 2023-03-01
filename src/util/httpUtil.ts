import { Context } from '@midwayjs/koa';

export function getUserIp(ctx: Context): string {
  // const ip = (ctx.headers['x-forwarded-for'] as string) || ctx.request.ip;
  return process.env.NODE_ENV === 'local' ? '127.0.0.1' : '';
}

export function getValueFromHeader(ctx: Context, field: string): string {
  return ctx.headers[field.toLowerCase()] as string;
}
