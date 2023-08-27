import {
  Consumer,
  MSListenerType,
  RabbitMQListener,
  Inject,
} from '@midwayjs/core';
import { Context } from '@midwayjs/rabbitmq';
import { ConsumeMessage } from 'amqplib';
import { ArticleService } from '../service/Article.service';

@Consumer(MSListenerType.RABBITMQ)
export class UserConsumer {
  @Inject()
  ctx: Context;

  @Inject()
  articleService: ArticleService;

  @RabbitMQListener(`article_${process.env.NODE_ENV}`)
  async gotData(msg: ConsumeMessage) {
    this.ctx.logger.info(`
          mq收到队列${`article_${process.env.NODE_ENV}`}消息,${msg.content.toString()}
    `);
    const payload = JSON.parse(msg.content.toString());
    const { id } = payload;
    await this.articleService.db2es(id);
    this.ctx.channel.ack(msg);
  }
}
