import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Dictionary } from './Dictionary';

export enum ARTICLE_TAG {
  ADMIN = 'admin',
  EDITOR = 'editor',
  GHOST = 'ghost',
}

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
  tagId: string;
  @OneToOne(() => Dictionary, { createForeignKeyConstraints: false })
  @JoinColumn()
  tag: string;
  @Column()
  orderNum: number;
  @Column()
  isRelease: boolean;
}
