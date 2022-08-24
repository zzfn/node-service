import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryColumn({ name: 'ID', length: 32 })
  id: string;

  @Column({ name: 'CREATE_BY', width: 32,nullable:true })
  createBy: string;

  @Column({ name: 'UPDATE_BY', width: 32,nullable:true })
  updateBy: string;

  @UpdateDateColumn({ name: 'UPDATE_TIME', type: 'timestamp',nullable:true })
  updateTime: Date;

  @CreateDateColumn({ name: 'CREATE_TIME', type: 'timestamp',nullable:true })
  createTime: Date;

  @DeleteDateColumn({ name: 'DELETE_TIME', type: 'timestamp',nullable:true })
  deleteTime: Date;
}
