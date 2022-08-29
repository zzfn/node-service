import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Menu extends BaseEntity {
  @Column()
  name: string;
  @Column()
  path: string;
  @Column()
  component: string;
  @Column()
  icon: string;
}
