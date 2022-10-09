import { Inject, Logger, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { ILogger } from '@midwayjs/logger';
import { Menu } from '../entity/Menu';
import { SnowflakeIdGenerate } from './Snowflake';
import { Context } from '@midwayjs/koa';

@Provide()
export class MenuService {
  @InjectEntityModel(Menu)
  menuModel;
  @Logger()
  logger: ILogger;
  @Inject()
  ctx: Context;
  @Inject()
  idGenerate: SnowflakeIdGenerate;

  async menuList() {
    if (this.ctx.state.user.isAdmin) {
      return this.menuModel.find();
    } else {
      return this.menuModel.find({
        where: { isAdmin: false },
      });
    }
  }

  async menuSave(menu: Menu) {
    menu.id = this.idGenerate.nextId().toString();
    return this.menuModel.save(menu);
  }

  async getOne(id: string) {
    return this.menuModel.findOneBy({ id });
  }
}
