import { AppDataSource } from '../../../shared/database/data-source'
import { Category } from '../entities/category.entity'
import { CategoryAlreadyExistsError } from '../errors/category-already-exists.error'
import { CategoryNotFoundError } from '../errors/category-not-found.error'
import { type UpdateCategoryData } from '../schemas/update-category.schema'

export const updateCategoryService = async (
  categoryId: string,
  data: UpdateCategoryData
): Promise<Category> => {
  const categoryRepository = AppDataSource.getRepository(Category)

  const category = await categoryRepository.findOne({
    where: { id: categoryId },
  })

  if (!category) {
    throw new CategoryNotFoundError()
  }

  if (data.name && data.name !== category.name) {
    const categoryWithSameName = await categoryRepository.findOne({
      where: { name: data.name },
    })

    if (categoryWithSameName && categoryWithSameName.id !== category.id) {
      throw new CategoryAlreadyExistsError()
    }
  }

  Object.assign(category, data)

  return categoryRepository.save(category)
}
