import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { ChangeLog } from '../entity/ChangeLog';
import { BaseService } from './BaseService';
import { Repository } from 'typeorm';

@Provide()
export class ChangeLogService extends BaseService<ChangeLog> {
  @InjectEntityModel(ChangeLog)
  model;

  getModel(): Repository<ChangeLog> {
    return this.model;
  }
}
