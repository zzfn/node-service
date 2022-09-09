import { Inject, Logger, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { ILogger } from '@midwayjs/logger';
import { Menu } from '../entity/Menu';
import { SnowflakeIdGenerate } from './Snowflake';

@Provide()
export class MenuService {
  @InjectEntityModel(Menu)
  menuModel;
  @Logger()
  logger: ILogger;
  @Inject()
  idGenerate: SnowflakeIdGenerate;

  async menuList() {
    return this.menuModel.find({});
  }

  async menuSave(menu: Menu) {
    menu.id = this.idGenerate.nextId().toString();
    return this.menuModel.save(menu);
  }

  async getOne(id: string) {
    return this.menuModel.findOneBy({ id });
  }
}
