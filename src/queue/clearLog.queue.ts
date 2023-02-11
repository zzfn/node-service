import { Processor, IProcessor } from '@midwayjs/bull';
import { FORMAT, Inject } from '@midwayjs/core';
import { SearchService } from '../service/Search.service';
import { NotifyService } from '../service/NotifyService.service';
import { Logger } from '@midwayjs/decorator';
import { ILogger } from '@midwayjs/logger';

@Processor('clearLog', {
  repeat: {
    cron: FORMAT.CRONTAB.EVERY_DAY_ONE_FIFTEEN,
  },
})
export class TestProcessor implements IProcessor {
  @Inject()
  searchService: SearchService;
  @Inject()
  notifyService: NotifyService;
  @Logger()
  logger: ILogger;

  async execute() {
    this.logger.info('开始清除日志');
    const count = await this.searchService.delete30d();
    await this.notifyService.bark({
      title: '定时删除日志成功',
      body: `共计删除日志${count}条`,
    });
  }
}
