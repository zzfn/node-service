import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Friend } from '../entity/Friend';
import { Inject } from '@midwayjs/decorator';
import { SnowflakeIdGenerate } from './Snowflake';
import { RedisService } from '@midwayjs/redis';
import { getUserIp } from '../util/httpUtil';
import { Context } from '@midwayjs/koa';
import { CustomError } from "../error/CustomError";

@Provide()
export class FriendService {
  @InjectEntityModel(Friend)
  friendModel;
  @Inject()
  idGenerate: SnowflakeIdGenerate;
  @Inject()
  redisService: RedisService;
  @Inject()
  ctx: Context;

  async list() {
    return await this.friendModel.find({});
  }

  async save(friend: Friend) {
    const ip = getUserIp(this.ctx);
    const exists = await this.redisService.exists(
      `applyFriend:${friend.visitorId}:${ip}`
    );
    if (exists) {
      throw new CustomError('过于频繁申请');
    } else {
      await this.redisService.set(
        `applyFriend:${friend.visitorId}:${ip}`,
        Date.now(),
        'EX',
        60 * 10
      );
    }
    if (!friend.id) {
      friend.id = this.idGenerate.nextId().toString();
    }
    await this.friendModel.save(friend);
    return true;
  }
}
