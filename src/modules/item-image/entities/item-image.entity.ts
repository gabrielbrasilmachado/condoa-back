import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'
import { Item } from '../../item/entities/item.entity'

@Entity('item_images')
@Index('UQ_item_images_primary_per_item', ['itemId'], {
  unique: true,
  where: '"is_primary" = true',
})
export class ItemImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'item_id', type: 'uuid' })
  itemId!: string

  @Column({ type: 'varchar', length: 50 })
  provider!: string

  @Column({ type: 'varchar', length: 255 })
  bucket!: string

  @Column({ type: 'varchar', length: 500 })
  key!: string

  @Column({ type: 'text' })
  url!: string

  @Column({ name: 'mime_type', type: 'varchar', length: 255 })
  mimeType!: string

  @Column({ type: 'int' })
  size!: number

  @Column({ name: 'original_name', type: 'varchar', length: 255 })
  originalName!: string

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary!: boolean

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date

  @ManyToOne(() => Item, (item) => item.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'item_id' })
  item!: Relation<Item>
}
