import { Inject, Logger, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { ILogger } from '@midwayjs/logger';
import { SnowflakeIdGenerate } from './Snowflake';
import { Comment } from '../entity/Comment';
import { Context } from '@midwayjs/koa';

// import { Reply } from '../entity/Reply';

@Provide()
export class CommentService {
  @InjectEntityModel(Comment)
  commentModel;
  @Logger()
  logger: ILogger;
  @Inject()
  idGenerate: SnowflakeIdGenerate;
  @Inject()
  ctx: Context;

  async list(id: string) {
    // return await this.commentModel
    //   .createQueryBuilder('comment')
    //   .leftJoinAndSelect(Reply, 'reply', 'reply.commentId=comment.id')
    //   .where('comment.interfaceId = :interfaceId', { interfaceId: id })
    //   .getRawMany();
    return await this.commentModel
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.replyInfos', 'replyInfos')
      .leftJoinAndMapOne(
        'replyInfos.userInfo',
        'user',
        'userInfo1',
        'userInfo1.id = replyInfos.createBy'
      )
      // .leftJoinAndSelect(User, 'user', 'user.id = comment.createBy')
      .leftJoinAndMapOne(
        'comment.userInfo',
        'user',
        'userInfo',
        'userInfo.id = comment.createBy'
      )
      .getMany();
  }

  async commentSave(comment: Comment) {
    comment.id = this.idGenerate.nextId();
    comment.createBy = this.ctx.state.user.uid;
    comment.ip =
      (this.ctx.headers['x-forwarded-for'] as string) || this.ctx.request.ip;
    return this.commentModel.save(comment);
  }
}
