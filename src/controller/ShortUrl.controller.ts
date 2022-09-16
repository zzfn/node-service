import { Controller, Get, Inject } from '@midwayjs/decorator';
import { ShortUrlService } from '../service/ShortUrl.service';

@Controller('/short-url')
export class RoleController {
  @Inject()
  shortUrlService: ShortUrlService;

  @Get('/list')
  async roleList() {
    return await this.shortUrlService.list();
  }
}
