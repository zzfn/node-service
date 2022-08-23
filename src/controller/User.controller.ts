import { Inject, Controller, Get, Post, Body } from '@midwayjs/decorator';
import { UserService } from '../service/user.service';
import { JwtService } from '@midwayjs/jwt';
import { Context } from '@midwayjs/koa';
import { LoginVo } from '../vo/LoginVo';

@Controller('/user')
export class APIController {
  @Inject()
  JwtService: JwtService;

  @Inject()
  userService: UserService;

  @Inject()
  ctx: Context;

  @Post('/register')
  async register(@Body() user: LoginVo) {
    return await this.userService.register(user);
  }

  @Post('/login')
  async saveUser(@Body() user: LoginVo) {
    return await this.userService.login(user);
  }
  @Get('/getUserState')
  async getUserState() {
    return true;
  }

  @Get('/getUserInfo')
  async getUserInfo() {
    return await this.userService.getUserInfo();
  }
}
