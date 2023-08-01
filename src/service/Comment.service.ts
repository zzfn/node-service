import { InjectEntityModel } from '@midwayjs/typeorm';
import { ILogger } from '@midwayjs/logger';
import { SnowflakeIdGenerate } from './Snowflake';
import { Comment } from '../entity/Comment';
import { Context } from '@midwayjs/koa';
import { Inject, Logger, Provide, makeHttpRequest } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';
import { getUserIp, getValueFromHeader } from '../util/httpUtil';
import { Notify } from './Notify.service';

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
  @Inject()
  notify: Notify;

  async list(id: string) {
    return await this.commentModel.find({
      where: {
        postId: id,
      },
      order: {
        createTime: 'ASC',
      },
    });
  }

  async commentSave(comment: Comment) {
    const ip = getUserIp(this.ctx);
    const exists = await this.redisService.hexists('address', ip);
    let address;
    if (!exists) {
      const result = await makeHttpRequest(
        `https://restapi.amap.com/v3/ip?key=${process.env.map_key}&ip=${ip}`,
        {
          method: 'GET',
          dataType: 'json',
        }
      );
      const { province, city }: any = result.data;
      address = `${province}${city}` || '未知';
      await this.redisService.hsetnx('address', ip, address);
    } else {
      address = await this.redisService.hget('address', ip);
    }
    comment.id = this.idGenerate.nextId();
    comment.createBy = getValueFromHeader(this.ctx, 'visitorId');
    comment.ip = ip;
    comment.address = address;
    await this.notify.bark({
      title: `来自${address}的用户评论了你`,
      body: `在${comment.postId}中评论了${comment.content}`,
      url: `https://zzfzzf.com/article/${comment.postId}`,
    });
    return this.commentModel.save(comment);
  }
}
