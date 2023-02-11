import { Provide } from '@midwayjs/decorator';
import { makeHttpRequest } from '@midwayjs/core';

type BarkReq = {
  title: string;
  body: string;
  group?: string;
  icon?: string;
};

@Provide()
export class NotifyService {
  async bark({ title, body, group, icon }: BarkReq): Promise<any> {
    const { data } = await makeHttpRequest(process.env.BARK_URL, {
      method: 'POST',
      data: {
        title,
        body,
        group,
        icon,
      },
      dataType: 'json',
      contentType: 'json',
    });
    return data;
  }
}
