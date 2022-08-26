import {
  Controller,
  Files,
  Get,
  Inject,
  Post,
  Query,
} from '@midwayjs/decorator';
import { OSSService } from '@midwayjs/oss';

@Controller('/file')
export class APIController {
  @Inject()
  ossService: OSSService;

  @Post('/upload')
  async upload(@Files() files) {
    const result = await Promise.all(
      files.map(file =>
        this.ossService.put(`midway/${file.filename}`, file.data)
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
