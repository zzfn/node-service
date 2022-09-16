import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity()
export class ShortUrl extends BaseEntity {
  @Column()
  hash: string;
  @Column()
  url: string;
  @Column()
  isInRedis: boolean;
  @Column()
  expires: Date;
}
