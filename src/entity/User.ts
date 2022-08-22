import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  GHOST = 'ghost',
}

@Entity('t_user')
export class User extends BaseEntity {
  @Column({ name: 'USERNAME' })
  username: string;
  @Column({ name: 'PASSWORD' })
  password: string;
  @Column({ name: 'AVATAR' })
  avatar: string;
  @Column({ name: 'NICK_NAME' })
  nickName: string;
}
