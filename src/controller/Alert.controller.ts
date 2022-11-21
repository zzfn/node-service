import { Body, Controller, Post } from '@midwayjs/decorator';
import { makeHttpRequest } from '@midwayjs/core';

@Controller('/alert')
export class HomeController {
  @Post('/')
  async home(@Body() body: any): Promise<string> {
    try {
      const { commonAnnotations } = body;
      const { summary, description } = commonAnnotations;
      await makeHttpRequest(process.env.BARK_URL, {
        method: 'POST',
        data: {
          title: summary,
          body: description,
          group: 'prometheus',
          icon: 'https://cdn.orluma.ltd/midway/Prometheus.png',
        },
        dataType: 'json',
        contentType: 'json',
      });
    } catch (e) {
      await makeHttpRequest(process.env.BARK_URL, {
        method: 'POST',
        data: {
          title: 'Prometheus Alert Error',
          body: e.message,
          group: 'prometheus',
          icon: 'https://cdn.orluma.ltd/midway/Prometheus.png',
        },
        dataType: 'json',
        contentType: 'json',
      });
    }
    return 'Hello Midwayjs!';
  }
}
