import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm'
import { Condominium } from '../../condominium/entities/condominium.entity'
import { CondominiumRequest } from '../../condominium-request/entities/condominium-request.entity'
import { Item } from '../../item/entities/item.entity'
import { UserRole } from '../enums/user-role.enum'
import { UserStatus } from '../enums/user-status.enum'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Index('uq_users_email', { unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string

  @Column({ type: 'varchar', length: 20 })
  phone!: string

  @Column({ name: 'password', type: 'varchar', length: 255, select: false })
  password!: string

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role',
    default: UserRole.USER,
  })
  role!: UserRole

  @Column({
    type: 'enum',
    enum: UserStatus,
    enumName: 'user_status',
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus

  @Column({ name: 'condominium_id', type: 'uuid', nullable: true })
  condominiumId!: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date

  @ManyToOne(() => Condominium, (condominium) => condominium.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'condominium_id' })
  condominium!: Relation<Condominium | null>

  @OneToMany(() => Item, (item) => item.user)
  items!: Relation<Item[]>

  @OneToMany(() => CondominiumRequest, (request) => request.user)
  condominiumRequests!: Relation<CondominiumRequest[]>

  @OneToMany(() => CondominiumRequest, (request) => request.reviewedBy)
  reviewedCondominiumRequests!: Relation<CondominiumRequest[]>
}
