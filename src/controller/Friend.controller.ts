import { Controller, Get, Inject } from '@midwayjs/decorator';
import { AnonymousMiddleware } from '../middleware/anonymous.middleware';
import { FriendService } from '../service/Friend.service';

@Controller('/friend')
export class FriendController {
  @Inject()
  friendService: FriendService;

  @Get('/list', { middleware: [AnonymousMiddleware] })
  async list(): Promise<any> {
    return this.friendService.list();
  }
}
