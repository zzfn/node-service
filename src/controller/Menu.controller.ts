import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
} from '@midwayjs/decorator';
import { JwtService } from '@midwayjs/jwt';
import { Context } from '@midwayjs/koa';
import { MenuService } from '../service/Menu.service';
import { SnowflakeIdGenerate } from '../service/Snowflake';
import { Role } from '../entity/Role';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Resource } from '../entity/Resource';
import { Menu } from '../entity/Menu';

@Controller('/menu')
export class APIController {
  @Inject()
  JwtService: JwtService;

  @Inject()
  menuService: MenuService;

  @InjectEntityModel(Role)
  profileModel;
  @InjectEntityModel(Resource)
  resourceModel;
  @Inject()
  ctx: Context;
  @Inject()
  generateID: SnowflakeIdGenerate;

  @Get('/list')
  async menuList() {
    return this.menuService.menuList();
  }

  @Get('/getOne')
  async getOne(@Query('id') id: string) {
    return this.menuService.getOne(id);
  }

  @Post('/save')
  async menuSave(@Body() menu: Menu) {
    return this.menuService.menuSave(menu);
  }
}
