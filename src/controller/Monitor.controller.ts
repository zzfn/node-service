import { Controller, Get, Inject } from '@midwayjs/decorator';
import { CommentService } from '../service/Comment.service';
import { makeHttpRequest } from '@midwayjs/core';

@Controller('/monitor')
export class CommentController {
  @Inject()
  commentService: CommentService;

  @Get('/status')
  async status(): Promise<any> {
    const { data: statusTarget }: any = await makeHttpRequest(
      `${process.env.PROM_URL}/api/v1/query_range?query=probe_success&start=${
        Date.now() / 1000 - 60 * 60 * 24
      }&end=${Date.now() / 1000}&step=${60 * 60}`,
      {
        method: 'GET',
        dataType: 'json',
      }
    );
    const { data: nameTarget }: any = await makeHttpRequest(
      `${
        process.env.PROM_URL
      }/api/v1/targets/metadata?metric=probe_success&t=${Date.now()}`,
      {
        method: 'GET',
        dataType: 'json',
      }
    );
    const hashMap = new Map();
    nameTarget.data
      .map((_: any) => _.target)
      .forEach((_: any) => {
        hashMap.set(_.instance, _.name);
      });
    const resultMap = new Map();
    statusTarget.data.result.forEach((_: any) => {
      if (resultMap.has(hashMap.get(_.metric.instance))) {
        resultMap.set(hashMap.get(_.metric.instance), [
          ...resultMap.get(hashMap.get(_.metric.instance)),
          ..._.values,
        ]);
      } else {
        resultMap.set(hashMap.get(_.metric.instance), _.values);
      }
    });
    console.log(resultMap);
    return Array.from(resultMap);
  }
}
