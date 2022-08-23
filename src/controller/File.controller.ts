import { Controller, Files, Inject, Post } from '@midwayjs/decorator';
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
    return { success: true, message: 'OK', data: result.map(file => file.url) };
  }
}
