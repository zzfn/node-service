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
import { Menu } from '../entity/Menu';

@Controller('/menu')
export class APIController {
  @Inject()
  JwtService: JwtService;

  @Inject()
  menuService: MenuService;

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
