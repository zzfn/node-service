import { Logger, Provide } from '@midwayjs/decorator';
import { Inject, makeHttpRequest, sleep } from '@midwayjs/core';
import { Notify } from './Notify.service';
import { ILogger } from '@midwayjs/logger';

const UserAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36';

const juejinInfo = {
  checkInUrl: `https://api.juejin.cn/growth_api/v1/check_in`, //签到接口
  freeDrawCheckUrl: `https://api.juejin.cn/growth_api/v1/lottery_config/get`, //免费抽奖次数查询
  freeDrawUrl: `https://api.juejin.cn/growth_api/v1/lottery/draw`, //抽奖接口
  headers: {
    Referer: 'https://juejin.cn/',
    'User-Agent': UserAgent,
    cookie: process.env.sign_in_cookie,
  },
};

@Provide()
export class SignIn {
  @Inject()
  notify: Notify;
  @Logger()
  logger: ILogger;

  async autoExecution() {
    const isSuccess = await this.checkIn();
    if (!isSuccess) return;
    await sleep(2 * 1000);
    const canFreeDraw = await this.freeDrawCheck();
    if (!canFreeDraw) return;
    await this.freeDraw();
  }

  private async freeDrawCheck() {
    const { data }: any = await makeHttpRequest(juejinInfo.freeDrawCheckUrl, {
      method: 'GET',
      headers: juejinInfo.headers,
      dataType: 'json',
    });
    return data.data.free_count > 0;
  }

  private async freeDraw() {
    const { data }: any = await makeHttpRequest(juejinInfo.freeDrawUrl, {
      method: 'POST',
      headers: juejinInfo.headers,
      dataType: 'json',
    });
    await this.notify.bark({
      title: '抽奖成功',
      body: `获得${data.data.lottery_name}`,
      icon: data.data.lottery_image,
    });
  }

  private async checkIn(): Promise<any> {
    const { data }: any = await makeHttpRequest(juejinInfo.checkInUrl, {
      method: 'POST',
      headers: juejinInfo.headers,
      dataType: 'json',
    });
    const { err_no, err_msg } = data;
    const isSuccess = err_no === 0;
    await this.notify.bark({
      title: isSuccess ? '掘金签到成功' : '掘金签到失败',
      body: isSuccess
        ? `获得矿石${data.data.incr_point},现有矿石${data.data.sum_point}`
        : err_msg,
      icon: 'https://cdn.zzfzzf.com/midway/juejin.png?v=1',
    });
    return isSuccess;
  }
}
