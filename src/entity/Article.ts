import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Article extends BaseEntity {
  @Column()
  logo: string;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column()
  summary: string;
  @Column()
  tag: string;
  @Column()
  orderNum: number;
  @Column()
  isRelease: boolean;
}
