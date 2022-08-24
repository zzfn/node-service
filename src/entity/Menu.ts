import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Menu extends BaseEntity {
  @Column({ name: 'NAME' })
  name: string;
  @Column({ name: 'PATH' })
  path: string;
  @Column({ name: 'COMPONENT' })
  component: string;
  @Column({ name: 'ICON' })
  icon: string;
}
