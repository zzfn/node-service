import { Context } from '@midwayjs/koa';

export function getUserIp(ctx: Context): string {
  const forwardedIps = ctx.headers['x-forwarded-for'] as string;
  const ips = forwardedIps?.split(',').map(ip => ip.trim()) || [];
  const ip = ips.at(0) || ctx.request.ip;
  return process.env.NODE_ENV === 'local' ? '127.0.0.1' : ip;
}

export function getValueFromHeader(ctx: Context, field: string): string {
  return ctx.headers[field.toLowerCase()] as string;
}
