import { Body, Controller, Post } from '@midwayjs/decorator';
import { Inject } from '@midwayjs/core';
import { Notify } from '../service/Notify.service';

@Controller('/alert')
export class HomeController {
  @Inject()
  notify: Notify;

  @Post('/')
  async home(@Body() body: any): Promise<string> {
    try {
      const { commonAnnotations } = body;
      const { summary, description } = commonAnnotations;
      await this.notify.bark({
        title: summary,
        body: description,
        group: 'prometheus',
        icon: 'https://cdn.zzfzzf.com/midway/Prometheus.png',
      });
    } catch (e) {
      await this.notify.bark({
        title: 'Prometheus Alert Error',
        body: e.message,
        group: 'prometheus',
        icon: 'https://cdn.zzfzzf.com/midway/Prometheus.png',
      });
    }
    return 'Hello Midwayjs!';
  }
}
