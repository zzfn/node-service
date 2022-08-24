import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('article')
export class Article extends BaseEntity {
  @Column({ name: 'LOGO' })
  logo: string;

  @Column({ name: 'TITLE' })
  title: string;
  @Column({ name: 'CONTENT' })
  content: string;
  @Column({ name: 'TAG' })
  tag: string;
}
