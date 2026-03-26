import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string

  @Column({ name: 'token_hash', type: 'varchar', length: 255 })
  tokenHash!: string

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt!: Date

  @Column({ name: 'revoked_at', type: 'timestamp', nullable: true })
  revokedAt!: Date | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: Relation<User>
}
