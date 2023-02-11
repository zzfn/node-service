import { Processor, IProcessor } from '@midwayjs/bull';
import { FORMAT, Inject } from '@midwayjs/core';
import { SearchService } from '../service/Search.service';

@Processor('clearLog', {
  repeat: {
    cron: FORMAT.CRONTAB.EVERY_DAY_ONE_FIFTEEN,
  },
})
export class TestProcessor implements IProcessor {
  @Inject()
  searchService: SearchService;

  async execute() {
    await this.searchService.delete30d();
  }
}
