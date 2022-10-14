import {
  Controller,
  Fields,
  Files,
  Get,
  Inject,
  Post,
  Query,
} from '@midwayjs/decorator';
import { OSSService } from '@midwayjs/oss';
import { Authorize } from '../decorator/Authorize';

@Controller('/file')
export class APIController {
  @Inject()
  ossService: OSSService;

  @Post('/upload')
  @Authorize(true)
  async upload(@Files() files, @Fields() fields) {
    let path = 'midway';
    if (fields.path) {
      path = fields.path;
    }
    const result = await Promise.all(
      files.map(file =>
        this.ossService.put(`${path}/${file.filename}`, file.data)
      )
    );
    return result.map(file => file.url);
  }

  @Get('/files')
  async files(@Query('prefix') prefix: string) {
    const result = await this.ossService.list(
      { prefix, 'max-keys': '100', delimiter: '/' },
      {}
    );
    return {
      records: [
        ...(result.prefixes?.map(item => ({ dir: true, name: item })) ?? []),
        ...result.objects,
      ],
      nextMarker: result.nextMarker,
    };
  }
}
