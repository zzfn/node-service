import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Context } from '@midwayjs/koa';
import { SnowflakeIdGenerate } from './Snowflake';
import { Role } from '../entity/Role';

@Provide()
export class RoleService {
  @InjectEntityModel(Role)
  roleModel;

  @Inject()
  ctx: Context;

  @Inject()
  idGenerate: SnowflakeIdGenerate;

  async roleList() {
    return await this.roleModel.find({
      relations: {
        resource: true,
      },
    });
  }

  async roleSave(role: Role) {
    role.id = this.idGenerate.nextId().toString();
    role.createBy = this.ctx.state.user.uid;
    return await this.roleModel.save(role);
  }
}
