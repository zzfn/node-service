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

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updateTime: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createTime: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleteTime: Date;
}
