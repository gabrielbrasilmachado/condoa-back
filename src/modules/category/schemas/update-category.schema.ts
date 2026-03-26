import {
  type CreateCategoryData,
  type CreateCategoryInput,
} from './create-category.schema'

export type UpdateCategoryInput = CreateCategoryInput
export type UpdateCategoryData = CreateCategoryData

export { createCategorySchema as updateCategorySchema } from './create-category.schema'
