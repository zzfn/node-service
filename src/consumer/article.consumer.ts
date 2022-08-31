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

  @RabbitMQListener('local')
  async gotData(msg: ConsumeMessage) {
    console.log('mq收到队列local消息', msg.content.toString());
    const article = JSON.parse(msg.content.toString());
    await this.articleService.db2es(article.id);
    this.ctx.channel.ack(msg);
  }
}
