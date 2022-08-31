import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Role } from './Role';

@Entity()
export class Resource extends BaseEntity {
  @Column()
  code: string;
  @Column()
  name: string;
  @Column()
  type: string;
  @ManyToMany(() => Role, role => role.resource, {
    createForeignKeyConstraints: false,
  })
  role: Role[];
}
