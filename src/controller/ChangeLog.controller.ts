import { Controller, Get, Inject } from '@midwayjs/decorator';
import { AnonymousMiddleware } from '../middleware/anonymous.middleware';
// import { Cacheable } from '../decorator/Cacheable.decorator';
import { ChangeLogService } from '../service/ChangeLog.service';

@Controller('/changelog')
export class ChangeLogController {
  @Inject()
  changeLogService: ChangeLogService;

  @Get('/list', { middleware: [AnonymousMiddleware] })
  // @Cacheable('changelogList')
  async menuList() {
    return this.changeLogService.list({
      order: {
        createTime: 'DESC',
      },
    });
  }
}
