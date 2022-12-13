import { Body, Controller, Get, Inject } from '@midwayjs/decorator';
import { NavService } from '../service/Nav.service';
import { Nav } from '../entity/Nav';

@Controller('/nav')
export class NavController {
  @Inject()
  navService: NavService;
  @Get('/list')
  async home(@Body() body: any): Promise<Nav[]> {
    return this.navService.list();
  }
}
