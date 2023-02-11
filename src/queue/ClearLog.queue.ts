import { IProcessor, Processor } from '@midwayjs/bull';
import { Inject } from '@midwayjs/core';
import { SearchService } from '../service/Search.service';
import { Logger } from '@midwayjs/decorator';
import { ILogger } from '@midwayjs/logger';
import { Notify } from '../service/Notify.service';

@Processor(`clear_log_${process.env.NODE_ENV}`, {
  repeat: {
    cron: '0 15 1 * * *',
  },
})
export class ClearLogQueue implements IProcessor {
  @Inject()
  searchService: SearchService;
  @Inject()
  notify: Notify;
  @Logger()
  logger: ILogger;

  async execute() {
    this.logger.info('开始执行清除日志');
    const count = await this.searchService.delete30d();
    await this.notify.bark({
      title: '定时删除日志成功',
      body: `共计删除日志${count}条`,
    });
    this.logger.info('结束执行清除日志');
  }
}
