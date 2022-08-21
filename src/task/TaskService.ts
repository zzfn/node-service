import { FORMAT, Provide, TaskLocal } from '@midwayjs/decorator';

@Provide()
export class UserService {
  @TaskLocal(FORMAT.CRONTAB.EVERY_PER_5_MINUTE)
  async test() {
    console.log('this.helloService.getName()');
  }
}
