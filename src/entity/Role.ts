import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Resource } from './Resource';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Role extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => Resource, { createForeignKeyConstraints: false })
  @JoinTable({
    name: 'role_resource',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'resource_id' },
  })
  resource: Resource[];
}
