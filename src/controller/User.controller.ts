import {
  Inject,
  Controller,
  Get,
  Post,
  Body,
} from '@midwayjs/decorator';
import { UserService } from '../service/user.service';
import { JwtService } from '@midwayjs/jwt';
import { Context } from '@midwayjs/koa';
import { ResultUtil } from '../util/ResultUtil';
import {LoginVo} from "../vo/LoginVo";

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
    return ResultUtil.success(await this.userService.login(user));
  }
  @Get('/getUserState')
  async getUserState() {
    return ResultUtil.success(true)
  }

  @Get('/getUserInfo')
  async getUserInfo() {
    return ResultUtil.success(await this.userService.getUserInfo());
  }
}
