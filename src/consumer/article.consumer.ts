import {
  Consumer,
  MSListenerType,
  RabbitMQListener,
  Inject,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/rabbitmq';
import { ConsumeMessage } from 'amqplib';

@Consumer(MSListenerType.RABBITMQ)
export class UserConsumer {
  @Inject()
  ctx: Context;

  @RabbitMQListener('local')
  async gotData(msg: ConsumeMessage) {
    console.log('mq收到队列local消息', msg.content.toString());
    this.ctx.channel.ack(msg);
  }
}
