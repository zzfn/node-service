import {Controller, Files, Inject, Post} from '@midwayjs/decorator';
import {OSSService} from "@midwayjs/oss";

@Controller('/file')
export class APIController {

  @Inject()
  ossService: OSSService;

  @Post('/upload')
  async upload(@Files() files) {
    console.log(files)
    files.forEach(file =>{
      this.ossService.put(`midway/${file.filename}`, file.data)
    })
    return { success: true, message: 'OK', data: files };
  }
}
