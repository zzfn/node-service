import {Body, Controller, Get, Inject, Post, Query} from '@midwayjs/decorator';
import { ChangeLogService } from '../service/ChangeLog.service';

@Controller('/changelog')
export class ChangeLogController {
  @Inject()
  changeLogService: ChangeLogService;
  @Post('/save')
  async save(@Body() body: any) {
    return this.changeLogService.save(body);
  }
  @Get('/list')
  async changelogList() {
    return this.changeLogService.list({
      order: {
        createTime: 'DESC',
      },
    });
  }
  @Get('/getOne')
  async changelogOne(@Query('id') id: string) {
    return this.changeLogService.getById(id);
  }
  @Get('/latest')
  async changelogListLatest() {
    return this.changeLogService.getLatest();
  }
}
