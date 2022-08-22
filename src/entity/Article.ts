import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import {ApiBasicAuth, ApiProperty} from "@midwayjs/swagger";

@ApiBasicAuth()
@Entity('t_article')
export class Article extends BaseEntity {

  @ApiProperty({ example:'logo',description: 'logo'})
  @Column({ name: 'LOGO' })
  logo: string;

  @ApiProperty({example:'title', description: 'title'})
  @Column({ name: 'TITLE' })
  title: string;
  @Column({ name: 'CONTENT' })
  content: string;
  @Column({ name: 'TAG' })
  tag: string;
}
