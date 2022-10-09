import { Controller, Get, Inject } from '@midwayjs/decorator';
import { FriendService } from '../service/Friend.service';

@Controller('/friend')
export class FriendController {
  @Inject()
  friendService: FriendService;

  @Get('/list')
  async list(): Promise<any> {
    return this.friendService.list();
  }
}
