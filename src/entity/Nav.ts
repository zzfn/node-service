import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Nav extends BaseEntity {
  @Column()
  icon: string;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  url: string;
  @Column()
  local: boolean;
  @Column()
  private: boolean;
}
