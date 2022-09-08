import { Inject, Logger, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { ILogger } from '@midwayjs/logger';
import { SnowflakeIdGenerate } from './Snowflake';
import { Comment } from '../entity/Comment';
import { Context } from '@midwayjs/koa';
import { makeHttpRequest } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';

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
  @Inject()
  redisService: RedisService;

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
    const ip =
      '180.108.180.246' ||
      (this.ctx.headers['x-forwarded-for'] as string) ||
      this.ctx.request.ip;
    const exists = await this.redisService.hexists('address', ip);
    console.log('exists', exists);
    let address;
    if (!exists) {
      const result = await makeHttpRequest(
        `https://restapi.amap.com/v3/ip?key=${process.env.map_key}&ip=${ip}`,
        {
          method: 'GET',
          dataType: 'json',
        }
      );
      console.log(result.data);
      const { province, city } = result.data;
      address = `${province}${city}`;
      await this.redisService.hsetnx('address', ip, address);
    } else {
      address = await this.redisService.hget('address', ip);
    }
    comment.id = this.idGenerate.nextId();
    comment.createBy = this.ctx.state.user.uid;
    comment.ip = ip;
    comment.address = address;
    return this.commentModel.save(comment);
  }
}
