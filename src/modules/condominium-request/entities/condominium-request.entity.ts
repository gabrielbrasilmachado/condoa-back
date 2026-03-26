import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm'
import { Condominium } from '../../condominium/entities/condominium.entity'
import { User } from '../../user/entities/user.entity'
import { CondominiumRequestStatus } from '../enums/condominium-request-status.enum'

@Entity('condominium_requests')
@Index('IDX_condominium_requests_status', ['status'])
@Index('IDX_condominium_requests_user_id', ['userId'])
@Index('IDX_condominium_requests_condominium_id', ['condominiumId'])
@Index('IDX_condominium_requests_reviewed_by_user_id', ['reviewedByUserId'])
export class CondominiumRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string

  @Column({ name: 'condominium_id', type: 'uuid' })
  condominiumId!: string

  @Column({
    type: 'enum',
    enum: CondominiumRequestStatus,
    enumName: 'condominium_request_status',
    default: CondominiumRequestStatus.PENDING,
  })
  status!: CondominiumRequestStatus

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason!: string | null

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt!: Date | null

  @Column({ name: 'reviewed_by_user_id', type: 'uuid', nullable: true })
  reviewedByUserId!: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date

  @ManyToOne(() => User, (user) => user.condominiumRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: Relation<User>

  @ManyToOne(
    () => Condominium,
    (condominium) => condominium.condominiumRequests,
    {
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn({ name: 'condominium_id' })
  condominium!: Relation<Condominium>

  @ManyToOne(() => User, (user) => user.reviewedCondominiumRequests, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'reviewed_by_user_id' })
  reviewedBy!: Relation<User | null>
}
