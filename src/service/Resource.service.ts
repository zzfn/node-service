import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Context } from '@midwayjs/koa';
import { SnowflakeIdGenerate } from './Snowflake';
import { Role } from '../entity/Role';
import { Resource } from '../entity/Resource';

@Provide()
export class ResourceService {
  @InjectEntityModel(Resource)
  resourceModel;

  @Inject()
  ctx: Context;

  @Inject()
  idGenerate: SnowflakeIdGenerate;

  async resourceList() {
    return await this.resourceModel.find();
  }

  async resourceSave(role: Role) {
    return await this.resourceModel.save(role);
  }
}
