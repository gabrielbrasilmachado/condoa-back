import { AppDataSource } from '../../../shared/database/data-source'
import { Category } from '../entities/category.entity'
import { CategoryNotFoundError } from '../errors/category-not-found.error'

export const getCategoryByIdService = async (
  categoryId: string
): Promise<Category> => {
  const categoryRepository = AppDataSource.getRepository(Category)

  const category = await categoryRepository.findOne({
    where: { id: categoryId },
  })

  if (!category) {
    throw new CategoryNotFoundError()
  }

  return category
}
