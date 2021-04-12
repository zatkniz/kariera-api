import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../helpers/base.entity';
import * as bcrypt from 'bcrypt';
import { Company } from '../../company/entities/company.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  readonly name: string;

  @Column()
  readonly surname: string;

  @Column({ unique: true })
  readonly email: string;

  @Column({ select: false })
  readonly password: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  readonly email_verified_at: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((type) => Company, (company) => company.user_id)
  companies: Company[];

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  constructor(name: string, surname?: string, email?: string);
  constructor(name: string, surname: string, email?: string);
  constructor(name: string, surname: string, email: string);
  constructor(name?: string, surname?: string, email?: string);
  constructor(name?: string, surname?: string, email?: string) {
    super();
    this.name = name || '';
    this.surname = surname || '';
    this.email = email || '';
  }
}
