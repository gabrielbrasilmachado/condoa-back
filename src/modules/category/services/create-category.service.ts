import { AppDataSource } from '../../../shared/database/data-source'
import { Category } from '../entities/category.entity'
import { CategoryAlreadyExistsError } from '../errors/category-already-exists.error'
import { type CreateCategoryData } from '../schemas/create-category.schema'

export const createCategoryService = async (
  data: CreateCategoryData
): Promise<Category> => {
  const categoryRepository = AppDataSource.getRepository(Category)

  const existingCategory = await categoryRepository.findOne({
    where: { name: data.name },
  })

  if (existingCategory) {
    throw new CategoryAlreadyExistsError()
  }

  const category = categoryRepository.create({
    name: data.name,
  })

  return categoryRepository.save(category)
}
