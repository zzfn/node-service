import {
  OnWSConnection,
  OnWSDisConnection,
  OnWSMessage,
  WSBroadCast,
  WSController,
} from '@midwayjs/core';
import { Context } from '@midwayjs/ws';
import { App, Inject } from '@midwayjs/decorator';
import { RedisService } from '@midwayjs/redis';
import { Application } from '@midwayjs/ws';

@WSController('/')
export class SocketController {
  @Inject()
  ctx: Context;
  @Inject()
  redisService: RedisService;
  @App('webSocket')
  wsApp: Application;

  @OnWSConnection()
  async onConnectionMethod() {
    console.log('on client connect', this.ctx.readyState);
  }

  @OnWSMessage('message')
  @WSBroadCast()
  async gotMyMessage(data) {
    // return this.redisService.incrby('online', 1);
    return Buffer.from(data).toString();
  }

  @OnWSDisConnection()
  async disconnect(id: number) {
    await this.redisService.decrby('online', 1);
    const count = await this.redisService.get('online');
    this.wsApp.clients.forEach(ws => {
      ws.send(count);
    });
    this.ctx.send('message ' + id);
  }
}
