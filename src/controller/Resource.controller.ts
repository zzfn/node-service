import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
} from '@midwayjs/decorator';
import { JwtService } from '@midwayjs/jwt';
import { Context } from '@midwayjs/koa';
import { ResourceService } from '../service/Resource.service';
import { Resource } from '../entity/Resource';

@Controller('/resource')
export class ResourceController {
  @Inject()
  JwtService: JwtService;

  @Inject()
  resourceService: ResourceService;

  @Inject()
  ctx: Context;

  @Get('/list')
  async list() {
    return await this.resourceService.resourceList();
  }

  @Get('/listById')
  async listById(@Query('id') id: string) {
    return await this.resourceService.listById(id);
  }

  @Post('/save')
  async saveUser(@Body() resource: Resource) {
    return await this.resourceService.resourceSave(resource);
  }
}
