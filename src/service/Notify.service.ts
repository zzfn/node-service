import { Provide } from '@midwayjs/decorator';
import { makeHttpRequest } from '@midwayjs/core';

type BarkReq = {
  title: string;
  body: string;
  group?: string;
  icon?: string;
  url?: string;
};

@Provide()
export class Notify {
  async bark({ title, body, group, icon, url }: BarkReq): Promise<any> {
    const { data } = await makeHttpRequest(process.env.BARK_URL, {
      method: 'POST',
      data: {
        title,
        body,
        group,
        icon,
        url,
      },
      dataType: 'json',
      contentType: 'json',
    });
    return data;
  }
}
