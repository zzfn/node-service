import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator';
import { JwtService } from '@midwayjs/jwt';
import { Context } from '@midwayjs/koa';
import { RoleService } from '../service/Role.service';
import { Role } from '../entity/Role';

@Controller('/role')
export class RoleController {
  @Inject()
  JwtService: JwtService;

  @Inject()
  roleService: RoleService;

  @Inject()
  ctx: Context;

  @Get('/list')
  async roleList() {
    return await this.roleService.roleList();
  }

  @Post('/save')
  async roleSave(@Body() role: Role) {
    return await this.roleService.roleSave(role);
  }
}
