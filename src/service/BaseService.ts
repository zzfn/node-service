import { Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { FindOptionsOrder } from 'typeorm/find-options/FindOptionsOrder';
import { BaseEntity } from '../entity/BaseEntity';
import { Provide } from '@midwayjs/core';
@Provide()
export abstract class BaseService<T extends BaseEntity> {
  abstract getModel(): Repository<T>;
  public abstract entity: Repository<T>

  add(query) {
    return this.entity.save(query)
  }
  update(query) {
    return this.entity.update(query.id, query)
  }
  delete(ids: number | string | string[]) {
    return this.entity.delete(ids)
  }
  info(data) {
    return this.entity.findOne({ where: data })
  }
  async page1(data) {
    const { page = 1, size = 10 } = data
    const [list, total] = await this.entity.findAndCount({
      where: {},
      take: size,
      skip: (page - 1) * size
    })
    return { list, pagination: { total, size, page } }
  }
  list1(data?) {
    return this.entity.find({ where: data } as any)
  }

  async page(
    where: FindOptionsWhere<T>,
    pageNo: number,
    pageSize: number
  ) {
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
