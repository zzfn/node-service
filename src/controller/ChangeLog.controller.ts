import { Controller, Get, Inject } from '@midwayjs/decorator';
// import { Cacheable } from '../decorator/Cacheable.decorator';
import { ChangeLogService } from '../service/ChangeLog.service';

@Controller('/changelog')
export class ChangeLogController {
  @Inject()
  changeLogService: ChangeLogService;

  @Get('/list')
  // @Cacheable('changelogList')
  async menuList() {
    return this.changeLogService.list({
      order: {
        createTime: 'DESC',
      },
    });
  }
}
