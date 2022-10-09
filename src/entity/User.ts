import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

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
  @Column()
  isAdmin: boolean;
}
