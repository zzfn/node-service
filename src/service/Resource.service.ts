import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Context } from '@midwayjs/koa';
import { Resource } from '../entity/Resource';
import { Repository } from 'typeorm';
import { SnowflakeIdGenerate } from './Snowflake';

@Provide()
export class ResourceService {
  @InjectEntityModel(Resource)
  model: Repository<Resource>;

  @Inject()
  ctx: Context;

  @Inject()
  idGenerate: SnowflakeIdGenerate;

  async resourceList() {
    return await this.model.find();
  }

  async listById(id: string) {
    return await this.model.find({
      select: {
        role: false,
      },
      where: {
        role: {
          id,
        },
      },
    });
  }

  async resourceSave(resource: Resource) {
    resource.id = this.idGenerate.nextId().toString();
    resource.createBy = this.ctx.state.user.uid;
    return await this.model.save(resource);
  }
}
