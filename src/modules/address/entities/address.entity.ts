import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'
import { Condominium } from '../../condominium/entities/condominium.entity'

@Entity('addresses')
@Index('uq_addresses_condominium', ['condominiumId'], { unique: true })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'zip_code', type: 'varchar', length: 20 })
  zipCode!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'varchar', length: 20 })
  number!: string

  @Column({ type: 'varchar', length: 255 })
  district!: string

  @Column({ type: 'varchar', length: 255 })
  city!: string

  @Column({ type: 'varchar', length: 2 })
  state!: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  complement!: string | null

  @Column({ name: 'condominium_id', type: 'uuid' })
  condominiumId!: string

  @OneToOne(() => Condominium, (condominium) => condominium.address, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'condominium_id' })
  condominium!: Relation<Condominium>
}
