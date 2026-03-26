import { Router } from 'express'
import { authorize } from '../../auth/middlewares/authorize.middleware'
import { ensureAuthenticated } from '../../auth/middlewares/ensure-authenticated.middleware'
import { UserRole } from '../../user/enums/user-role.enum'
import { createCategoryController } from '../controllers/create-category.controller'
import { deleteCategoryController } from '../controllers/delete-category.controller'
import { getCategoryByIdController } from '../controllers/get-category-by-id.controller'
import { listCategoriesController } from '../controllers/list-categories.controller'
import { updateCategoryController } from '../controllers/update-category.controller'

const categoryRoutes = Router()

categoryRoutes.get(
  '/',
  ensureAuthenticated,
  authorize([UserRole.ADMIN, UserRole.USER]),
  listCategoriesController
)
categoryRoutes.post(
  '/',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  createCategoryController
)
categoryRoutes.get(
  '/:id',
  ensureAuthenticated,
  authorize([UserRole.ADMIN, UserRole.USER]),
  getCategoryByIdController
)
categoryRoutes.patch(
  '/:id',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  updateCategoryController
)
categoryRoutes.delete(
  '/:id',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  deleteCategoryController
)

export { categoryRoutes }
