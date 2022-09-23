import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

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
  @Column()
  reply: string;
}
