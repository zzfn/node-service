import {Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryColumn({name: 'ID'})
  id: string;
  @Column({name: 'CREATE_BY'})
  createBy: string;
  @Column({name: 'UPDATE_BY'})
  updateBy: string;
  @UpdateDateColumn({name: 'UPDATE_TIME', type: 'timestamp', default: () => "NOW()"})
  updateTime: Date;
  @CreateDateColumn({name: 'CREATE_TIME', type: 'timestamp', default: () => "NOW()"})
  createTime: Date;
  @Column({name: 'IS_DELETE', default: 0})
  isDelete: number;
}
