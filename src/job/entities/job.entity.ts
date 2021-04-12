import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../helpers/base.entity';

@Entity('jobs')
export class Job extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  readonly company_id: number;

  @Column()
  readonly user_id: number;
}
