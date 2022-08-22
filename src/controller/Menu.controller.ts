import {
  Inject,
  Controller,
  Get,
} from '@midwayjs/decorator';
import { UserService } from '../service/user.service';
import { JwtService } from '@midwayjs/jwt';
import { Context } from '@midwayjs/koa';
import { ResultUtil } from '../util/ResultUtil';

@Controller('/menu')
export class APIController {
  @Inject()
  JwtService: JwtService;

  @Inject()
  userService: UserService;

  @Inject()
  ctx: Context;

  @Get('/list')
  async getUserState() {
    return ResultUtil.success([])
  }
}
