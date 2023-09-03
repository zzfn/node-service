import { Controller, Get, Inject, Post } from '@midwayjs/core';
import { FriendService } from '../service/Friend.service';
import { Friend } from '../entity/Friend';
import { Body } from "@midwayjs/decorator";

@Controller('/friend')
export class FriendController {
  @Inject()
  friendService: FriendService;

  @Get('/list')
  async list(): Promise<any> {
    return this.friendService.list();
  }
  @Post('/save')
  async save(@Body() friend: Friend): Promise<any> {
    return this.friendService.save(friend);
  }
}
