import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm'
import { Address } from '../../address/entities/address.entity'
import { CondominiumRequest } from '../../condominium-request/entities/condominium-request.entity'
import { User } from '../../user/entities/user.entity'

@Entity('condominiums')
export class Condominium {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index('uq_condominiums_name', { unique: true })
  @Column({ type: 'varchar', length: 255 })
  name!: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date

  @OneToMany(() => User, (user) => user.condominium)
  users!: Relation<User[]>

  @OneToMany(() => CondominiumRequest, (request) => request.condominium)
  condominiumRequests!: Relation<CondominiumRequest[]>

  @OneToOne(() => Address, (address) => address.condominium)
  address!: Relation<Address | null>
}
