import {
  Inject,
  Controller,
  Get,
  Query,
  Post,
  Body,
} from '@midwayjs/decorator';
import { UserService } from '../service/user.service';
import { JwtService } from '@midwayjs/jwt';
import { Context } from '@midwayjs/koa';
import { ResultUtil } from '../util/ResultUtil';

@Controller('/user')
export class APIController {
  @Inject()
  JwtService: JwtService;

  @Inject()
  userService: UserService;
  @Inject()
  ctx: Context;

  @Post('/register')
  async register(@Body() user: { username: string; password: string }) {
    return await this.userService.register(user);
  }

  @Post('/login')
  async saveUser(@Body() user: { username: string; password: string }) {
    return ResultUtil.success(await this.userService.login(user));
  }

  @Get('/list')
  async getUser(@Query('uid') uid) {
    const user = await this.userService.getUser({ uid });
    return { success: true, message: 'OK', data: user };
  }
}
