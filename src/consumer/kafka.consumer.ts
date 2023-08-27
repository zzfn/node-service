import {
  App,
  Consumer,
  Inject,
  KafkaListener,
  Provide,
  MSListenerType,
} from '@midwayjs/core';
import { IMidwayKafkaContext } from '@midwayjs/kafka';
import { KafkaMessage } from 'kafkajs';
import { Application } from '@midwayjs/koa';
import { ArticleService } from '../service/Article.service';

@Provide()
@Consumer(MSListenerType.KAFKA)
export class KafkaConsumer {
  @App()
  app: Application;

  @Inject()
  ctx: IMidwayKafkaContext;

  @Inject()
  logger;

  @Inject()
  articleService: ArticleService;

  @KafkaListener(`update_viewed_${process.env.NODE_ENV}`)
  async gotData(message: KafkaMessage) {
    this.logger.info(
      'test1 output =>',
      message.offset + ' ' + message.key + ' ' + message.value.toString('utf8')
    );
    const target = JSON.parse(message.value.toString('utf8'));
    await this.articleService.updateViewed(target.postId, target.ip);
    await this.app.setAttr('total', this.app.getAttr<number>('total') + 1);
  }
}
