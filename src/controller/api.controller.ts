import {Inject, Controller, Get, Query, Post} from '@midwayjs/decorator';
import { UserService } from '../service/user.service';

@Controller('/api')
export class APIController {

  @Inject()
  userService: UserService;

  @Post('/user')
  async saveUser(@Query('uid') uid) {
    const user = await this.userService.saveUser({ uid });
    return { success: true, message: 'OK', data: user };
  }
  @Get('/user')
  async getUser(@Query('uid') uid) {
    console.log(this.userService.userModel)
    const user = await this.userService.getUser({ uid });
    return { success: true, message: 'OK', data: user };
  }
}
