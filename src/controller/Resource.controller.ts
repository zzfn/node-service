import { Body, Controller, Inject, Post } from '@midwayjs/decorator';
import { JwtService } from '@midwayjs/jwt';
import { Context } from '@midwayjs/koa';
import { Role } from '../entity/Role';
import { ResourceService } from '../service/Resource.service';

@Controller('/resource')
export class ResourceController {
  @Inject()
  JwtService: JwtService;

  @Inject()
  resourceService: ResourceService;

  @Inject()
  ctx: Context;

  @Post('/list')
  async register() {
    return await this.resourceService.resourceList();
  }

  @Post('/save')
  async saveUser(@Body() role: Role) {
    return await this.resourceService.resourceSave(role);
  }
}
