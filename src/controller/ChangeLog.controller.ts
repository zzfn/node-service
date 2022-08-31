import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator';
import { MenuService } from '../service/Menu.service';
import { Menu } from '../entity/Menu';

@Controller('/changelog')
export class ChangeLogController {
  @Inject()
  menuService: MenuService;

  @Get('/list')
  async menuList() {
    return this.menuService.menuList();
  }

  @Post('/save')
  async menuSave(@Body() menu: Menu) {
    return this.menuService.menuSave(menu);
  }
}
