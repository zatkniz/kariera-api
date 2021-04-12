import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../helpers/base.entity';

@Entity('companies')
export class Company extends BaseEntity {
  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  readonly user_id: number;
}
