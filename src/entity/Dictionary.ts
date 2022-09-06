import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Dictionary extends BaseEntity {
  @Column()
  name: string;
}
