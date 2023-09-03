import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Friend extends BaseEntity {
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  logo: string;
  @Column()
  url: string;

  visitorId: string;
  @Column()
  isRelease: boolean;
}
