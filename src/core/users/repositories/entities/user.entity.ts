import { Customer } from 'src/core/customers/repositories/entities/customer.entity';
import { Proposal } from 'src/core/proposals/repositories/entities/proposal.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Customer, (customer) => customer.userCreator)
  createdCustomers: Customer[];

  @OneToMany(() => Proposal, (proposal) => proposal.userCreator)
  proposals: Proposal[];

  @Column({ nullable: false, type: 'varchar', length: 200 })
  name: string;

  @Column({ nullable: false, type: 'decimal', default: 0 })
  balance: number;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'datetime' })
  updatedAt: Date;
}
