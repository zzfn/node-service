import {
  Consumer,
  MSListenerType,
  RabbitMQListener,
  Inject,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/rabbitmq';
import { ConsumeMessage } from 'amqplib';
import { ArticleService } from '../service/Article.service';

@Consumer(MSListenerType.RABBITMQ)
export class UserConsumer {
  @Inject()
  ctx: Context;

  @Inject()
  articleService: ArticleService;

  @RabbitMQListener(process.env.mq_queue)
  async gotData(msg: ConsumeMessage) {
    console.log(
      `mq收到队列${process.env.mq_queue}消息`,
      msg.content.toString()
    );
    const payload = JSON.parse(msg.content.toString());
    const { id } = payload;
    await this.articleService.db2es(id);
    this.ctx.channel.ack(msg);
  }
}
