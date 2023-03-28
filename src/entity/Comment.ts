import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Comment extends BaseEntity {
  @Column()
  postId: string;
  @Column()
  content: string;
  @Column()
  ip: string;
  @Column()
  address: string;
  @Column()
  replyUserId: string;
  @Column()
  parentCommentId: string;
}
