import { BaseEntity, Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { FindOptionsOrder } from 'typeorm/find-options/FindOptionsOrder';

export abstract class BaseService<T extends BaseEntity> {
  abstract getModel(): Repository<T>;

  async page(
    where: FindOptionsWhere<T>,
    pageNo: number,
    pageSize: number
  ): Promise<any> {
    const skip = (pageNo - 1) * pageSize;
    const take = pageSize;
    const order: FindOptionsOrder<T> = {
      createTime: 'desc',
    } as FindOptionsOrder<any>;
    const res = await this.getModel().findAndCount({
      where,
      order,
      skip,
      take,
    });
    return {
      records: res[0],
      total: res[1],
      pageNo,
      pageSize,
    };
  }
}
