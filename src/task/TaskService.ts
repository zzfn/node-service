import { FORMAT, Inject, Provide, TaskLocal } from '@midwayjs/core';
import { SearchService } from '../service/Search.service';

@Provide()
export class UserService {
  @Inject()
  searchService: SearchService;

  @TaskLocal(FORMAT.CRONTAB.EVERY_DAY_ONE_FIFTEEN)
  async test() {
    await this.searchService.delete30d();
  }
}
