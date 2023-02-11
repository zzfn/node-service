import { IProcessor, Processor } from '@midwayjs/bull';
import { Inject } from '@midwayjs/core';
import { Logger } from '@midwayjs/decorator';
import { ILogger } from '@midwayjs/logger';
import { Notify } from '../service/Notify.service';
import { SignIn } from '../service/SignIn.service';

@Processor(`sign_in_${process.env.NODE_ENV}`, {
  repeat: {
    cron: '0 15 2 * * *',
  },
})
export class SignInQueue implements IProcessor {
  @Inject()
  notify: Notify;
  @Logger()
  logger: ILogger;
  @Inject()
  signIn: SignIn;

  async execute() {
    this.logger.info('开始执行签到任务');
    await this.signIn.autoExecution();
    this.logger.info('结束执行签到任务');
  }
}
