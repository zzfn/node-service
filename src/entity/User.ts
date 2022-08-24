import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Role } from './Role';

@Entity()
export class User extends BaseEntity {
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  avatar: string;
  @Column()
  nickname: string;

  @ManyToMany(() => Role, { createForeignKeyConstraints: false })
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  role: Role[];
}
