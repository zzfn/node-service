import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Resource extends BaseEntity {
  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  type: string;
}
