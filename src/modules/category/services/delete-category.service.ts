import { AppDataSource } from '../../../shared/database/data-source'
import { Item } from '../../item/entities/item.entity'
import { Category } from '../entities/category.entity'
import { CategoryHasItemsError } from '../errors/category-has-items.error'
import { CategoryNotFoundError } from '../errors/category-not-found.error'

export const deleteCategoryService = async (
  categoryId: string
): Promise<void> => {
  const categoryRepository = AppDataSource.getRepository(Category)
  const itemRepository = AppDataSource.getRepository(Item)

  const category = await categoryRepository.findOne({
    where: { id: categoryId },
  })

  if (!category) {
    throw new CategoryNotFoundError()
  }

  const relatedItem = await itemRepository.findOne({
    where: { categoryId },
    select: {
      id: true,
    },
  })

  if (relatedItem) {
    throw new CategoryHasItemsError()
  }

  await categoryRepository.remove(category)
}
