import {
  OnWSConnection,
  OnWSDisConnection,
  OnWSMessage,
  WSController,
  WSEmit,
} from '@midwayjs/core';
import { Context } from '@midwayjs/socketio';
import { Inject } from '@midwayjs/decorator';
import { RedisService } from '@midwayjs/redis';

@WSController('/')
export class SocketController {
  @Inject()
  ctx: Context;
  @Inject()
  redisService: RedisService;

  @OnWSConnection()
  async onConnectionMethod() {
    console.log('on online connect', this.ctx.id);
    await this.redisService.sadd(
      'online',
      this.ctx.handshake.query.userId as string
    );
    this.ctx.nsp.emit('online', await this.redisService.scard('online'));
  }

  @OnWSMessage('online')
  @WSEmit('onlineResult')
  async gotMessage(data) {
    console.log('on data got', this.ctx.id, data);
    return 'hello world';
  }

  @OnWSDisConnection()
  async onDisConnectionMethod() {
    console.log('on disconnect', this.ctx.id);
    await this.redisService.srem(
      'online',
      this.ctx.handshake.query.userId as string
    );
    this.ctx.nsp.emit('online', await this.redisService.scard('online'));
  }
}
