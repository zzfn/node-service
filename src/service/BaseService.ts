import { Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { FindOptionsOrder } from 'typeorm/find-options/FindOptionsOrder';
import { BaseEntity } from '../entity/BaseEntity';

export abstract class BaseService<T extends BaseEntity> {
  abstract getModel(): Repository<T>;

  async page(
    where: FindOptionsWhere<T>,
    pageNo: number,
    pageSize: number
  ): Promise<any> {
    const skip = (pageNo - 1) * pageSize;
    const take = pageSize;
    const [records, total] = await this.getModel().findAndCount({
      where,
      order: {
        createTime: 'desc',
      } as FindOptionsOrder<T>,
      skip,
      take,
    });
    return {
      records,
      total,
      pageNo,
      pageSize,
    };
  }

  async list(options = {}) {
    return await this.getModel().find(options);
  }
  async getById(id: string) {
    return await this.getModel().findOneBy({ id } as FindOptionsWhere<T>);
  }
  async save(record: T) {
    return await this.getModel().save(record);
  }
  async remove(id: string) {
    return await this.getModel().softDelete(id);
  }
}
