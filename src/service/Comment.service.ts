import { Inject, Logger, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { ILogger } from '@midwayjs/logger';
import { SnowflakeIdGenerate } from './Snowflake';
import { Comment } from '../entity/Comment';
import { Context } from '@midwayjs/koa';
import { makeHttpRequest } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';
import { getUserIp, getValueFromHeader } from '../util/httpUtil';

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
    return await this.commentModel.find({
      where: {
        interfaceId: id,
      },
      order: {
        createTime: 'DESC',
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
      const { province, city } = result.data;
      address = `${province}${city}`;
      await this.redisService.hsetnx('address', ip, address);
    } else {
      address = await this.redisService.hget('address', ip);
    }
    comment.id = this.idGenerate.nextId();
    comment.createBy = getValueFromHeader(this.ctx, 'visitorId');
    comment.ip = ip;
    comment.address = address;
    return this.commentModel.save(comment);
  }
}
