import { Body, Controller, Post } from '@midwayjs/decorator';

@Controller('/')
export class HomeController {
  @Post('/')
  async home(@Body() req: any): Promise<string> {
    console.log(JSON.stringify(req));
    return 'Hello Midwayjs!';
  }
}
