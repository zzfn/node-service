import {Logger, Provide} from '@midwayjs/decorator';
import {InjectEntityModel} from '@midwayjs/typeorm';
import {ILogger} from '@midwayjs/logger';
import {Menu} from "../entity/Menu";

@Provide()
export class MenuService {
  @InjectEntityModel(Menu)
  menuModel;
  @Logger()
  logger: ILogger;

  async menuList() {
    return this.menuModel.find({});
  }
}
