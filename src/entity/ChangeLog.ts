import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity()
export class ChangeLog extends BaseEntity {
  @Column()
  title: string;
  @Column()
  content: string;
}
