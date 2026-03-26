import { AppDataSource } from '../../../shared/database/data-source'
import { Category } from '../entities/category.entity'

export const listCategoriesService = async (): Promise<Category[]> => {
  const categoryRepository = AppDataSource.getRepository(Category)

  return categoryRepository.find({
    order: {
      name: 'ASC',
    },
  })
}
