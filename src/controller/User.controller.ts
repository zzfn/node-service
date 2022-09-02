import {
  Inject,
  Controller,
  Get,
  Post,
  Body,
  Query,
  Queries,
} from '@midwayjs/decorator';
import { UserService } from '../service/user.service';
import { JwtService } from '@midwayjs/jwt';
import { Context } from '@midwayjs/koa';
import { LoginVo } from '../vo/LoginVo';
import { User } from '../entity/User';
import { PageVo } from '../vo/PageVo';
import { AnonymousMiddleware } from '../middleware/anonymous.middleware';

@Controller('/user')
export class APIController {
  @Inject()
  JwtService: JwtService;

  @Inject()
  userService: UserService;

  @Inject()
  ctx: Context;

  @Post('/register', { middleware: [AnonymousMiddleware] })
  async register(@Body() user: LoginVo) {
    return await this.userService.register(user);
  }

  @Post('/login', { middleware: [AnonymousMiddleware] })
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

  @Get('/list')
  async userList(@Queries() pageVo: PageVo) {
    return await this.userService.page({}, pageVo.current, pageVo.pageSize);
  }

  @Get('/infoById')
  async infoById(@Query('id') id: string) {
    return await this.userService.infoById(id);
  }

  @Post('/changeRoleByUserId')
  async changeRoleByUserId(
    @Body() userRole: { userId: string; roleId: string; isAdd: boolean }
  ) {
    return await this.userService.updateRole(userRole);
  }

  @Post('/changeUser')
  async changeUser(@Body() user: User) {
    return await this.userService.update(user);
  }
}
