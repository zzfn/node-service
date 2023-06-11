import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { BaseService } from './BaseService';
import { Repository } from 'typeorm';
import { Nav } from '../entity/Nav';

@Provide()
export class NavService extends BaseService<Nav> {
  public entity: Repository<Nav>;
  @InjectEntityModel(Nav)
  navModel: Repository<Nav>;

  getModel(): Repository<Nav> {
    return this.navModel;
  }

  async list() {
    return await this.navModel.find();
  }
}
