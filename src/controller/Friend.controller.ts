import { Controller, Get, Inject, Post } from '@midwayjs/core';
import { FriendService } from '../service/Friend.service';

@Controller('/friend')
export class FriendController {
  @Inject()
  friendService: FriendService;

  @Get('/list')
  async list(): Promise<any> {
    return this.friendService.list();
  }
  @Post('/save')
  async save(): Promise<any> {
    return this.friendService.list();
  }
}
