import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm'
import { Category } from '../../category/entities/category.entity'
import { ItemImage } from '../../item-image/entities/item-image.entity'
import { User } from '../../user/entities/user.entity'
import { ItemStatus } from '../enums/item-status.enum'

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'text' })
  description!: string

  @Column({
    type: 'enum',
    enum: ItemStatus,
    enumName: 'item_status',
    default: ItemStatus.AVAILABLE,
  })
  status!: ItemStatus

  @Column({ name: 'expired_at', type: 'timestamp', nullable: true })
  expiredAt!: Date | null

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId!: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date

  @ManyToOne(() => Category, (category) => category.items)
  @JoinColumn({ name: 'category_id' })
  category!: Relation<Category>

  @ManyToOne(() => User, (user) => user.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: Relation<User>

  @OneToMany(() => ItemImage, (image) => image.item)
  images!: Relation<ItemImage[]>
}
