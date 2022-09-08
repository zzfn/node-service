import { Inject, Logger, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { ILogger } from '@midwayjs/logger';
import { SnowflakeIdGenerate } from './Snowflake';
import { Reply } from '../entity/Reply';

@Provide()
export class ReplyService {
  @InjectEntityModel(Reply)
  replyModel;
  @Logger()
  logger: ILogger;
  @Inject()
  idGenerate: SnowflakeIdGenerate;

  async replySave(reply: Reply) {
    reply.id = this.idGenerate.nextId();
    return this.replyModel.save(reply);
  }
}
