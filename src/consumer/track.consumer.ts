import {
  Consumer,
  Inject,
  MSListenerType,
  RabbitMQListener,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/rabbitmq';
import { ConsumeMessage } from 'amqplib';
import { SearchService } from '../service/Search.service';

@Consumer(MSListenerType.RABBITMQ)
export class TrackConsumer {
  @Inject()
  ctx: Context;

  @Inject()
  searchService: SearchService;

  @RabbitMQListener(`log_${process.env.NODE_ENV}`)
  async gotData(msg: ConsumeMessage) {
    this.ctx.logger.info(
      `mq收到队列${`log_${process.env.NODE_ENV}`}消息,
      ${msg.content.toString()}`
    );
    const payload = JSON.parse(msg.content.toString());
    await this.searchService.save(payload);
    this.ctx.channel.ack(msg);
  }
}
