import { Controller, Get } from '@midwayjs/decorator';
import { Authorize } from '../decorator/Authorize';

@Controller('/')
export class HomeController {
  @Get('/')
  @Authorize(true)
  async home(): Promise<string> {
    return 'Hello Midwayjs!';
  }
}
