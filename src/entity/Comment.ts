import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Reply } from './Reply';
import { User } from './User';

@Entity()
export class Comment extends BaseEntity {
  @Column()
  interfaceId: string;
  @Column()
  content: string;
  @Column()
  ip: string;
  @Column()
  address: string;
  @OneToMany(() => Reply, reply => reply.comment, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  replyInfos: Reply[];

  userInfo: User;
}
