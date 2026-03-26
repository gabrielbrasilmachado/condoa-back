import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'
import { Item } from '../../item/entities/item.entity'

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index('uq_categories_name', { unique: true })
  @Column({ type: 'varchar', length: 255 })
  name!: string

  @OneToMany(() => Item, (item) => item.category)
  items!: Relation<Item[]>
}
