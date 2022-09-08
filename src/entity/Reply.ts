import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Comment } from './Comment';
import {User} from "./User";

@Entity()
export class Reply extends BaseEntity {
  @ManyToOne(() => Comment, comment => comment.replyInfos, {
    createForeignKeyConstraints: false,
  })
  comment: string;
  @Column()
  ip: string;
  @Column()
  address: string;
  @Column()
  content: string;

  userInfo: User;
}
