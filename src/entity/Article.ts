import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Article extends BaseEntity {
  @Column()
  logo: string;
  @Column()
  title: string;
  @Column({ type: 'longtext' })
  content: string;
  @Column()
  summary: string;
  @Column()
  tag: string;
  @Column()
  viewCount: number;
  @Column()
  orderNum: number;
  @Column()
  isRelease: boolean;
}
