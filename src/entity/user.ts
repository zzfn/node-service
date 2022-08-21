import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('t_user')
export class User {
  @PrimaryColumn()
  id: string;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  avatar: string;
  @Column()
  nickname: string;
  @Column()
  isPublished: boolean;
}
