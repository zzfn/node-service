import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Friend } from "../entity/Friend";

@Provide()
export class FriendService {
  @InjectEntityModel(Friend)
  friendModel;

  async list() {
    return await this.friendModel.find({});
  }

  async save(friend: Friend) {
    return this.friendModel.save(friend);
  }
}
