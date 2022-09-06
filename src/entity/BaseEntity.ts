import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryColumn({ length: 32 })
  id: string;

  @Column({ width: 32, nullable: true })
  createBy: string;

  @Column({ width: 32, nullable: true })
  updateBy: string;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 0,
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP(0)',
    onUpdate: 'CURRENT_TIMESTAMP(0)',
  })
  updateTime: Date;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP(0)',
  })
  createTime: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    precision: 0,
    nullable: true,
  })
  deleteTime: Date;
}
