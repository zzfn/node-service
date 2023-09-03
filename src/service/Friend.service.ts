import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Friend } from "../entity/Friend";
import { Inject } from "@midwayjs/decorator";
import { SnowflakeIdGenerate } from "./Snowflake";

@Provide()
export class FriendService {
  @InjectEntityModel(Friend)
  friendModel;
  @Inject()
  idGenerate: SnowflakeIdGenerate;

  async list() {
    return await this.friendModel.find({});
  }

  async save(friend: Friend) {
    if (!friend.id) {
      friend.id = this.idGenerate.nextId().toString();
    }
    return await this.friendModel.save(friend);
  }
}
