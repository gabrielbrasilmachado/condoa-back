import { Router } from 'express'
import { authorize } from '../../auth/middlewares/authorize.middleware'
import { ensureAuthenticated } from '../../auth/middlewares/ensure-authenticated.middleware'
import { deleteItemImageController } from '../../item-image/controllers/delete-item-image.controller'
import { listItemImagesController } from '../../item-image/controllers/list-item-images.controller'
import { uploadItemImageController } from '../../item-image/controllers/upload-item-image.controller'
import { uploadItemImageMiddleware } from '../../item-image/middlewares/upload-item-image.middleware'
import { UserRole } from '../../user/enums/user-role.enum'
import { createItemController } from '../controllers/create-item.controller'
import { deleteItemController } from '../controllers/delete-item.controller'
import { getItemAnalyticsController } from '../controllers/get-item-analytics.controller'
import { getItemByIdController } from '../controllers/get-item-by-id.controller'
import {
  listItemsController,
  listOwnItemsController,
} from '../controllers/list-items.controller'
import { updateItemController } from '../controllers/update-item.controller'

const itemRoutes = Router()

itemRoutes.get(
  '/',
  ensureAuthenticated,
  authorize([UserRole.ADMIN, UserRole.USER]),
  listItemsController
)
itemRoutes.get(
  '/my-items',
  ensureAuthenticated,
  authorize([UserRole.ADMIN, UserRole.USER]),
  listOwnItemsController
)
itemRoutes.get(
  '/analytics',
  ensureAuthenticated,
  authorize([UserRole.ADMIN, UserRole.USER]),
  getItemAnalyticsController
)
itemRoutes.post(
  '/',
  ensureAuthenticated,
  authorize([UserRole.ADMIN, UserRole.USER]),
  createItemController
)
itemRoutes.get(
  '/:itemId/images',
  ensureAuthenticated,
  authorize([UserRole.ADMIN, UserRole.USER]),
  listItemImagesController
)
itemRoutes.post(
  '/:itemId/images',
  ensureAuthenticated,
  authorize([UserRole.ADMIN, UserRole.USER]),
  uploadItemImageMiddleware,
  uploadItemImageController
)
itemRoutes.delete(
  '/:itemId/images/:imageId',
  ensureAuthenticated,
  authorize([UserRole.ADMIN, UserRole.USER]),
  deleteItemImageController
)
itemRoutes.get(
  '/:id',
  ensureAuthenticated,
  authorize([UserRole.ADMIN, UserRole.USER]),
  getItemByIdController
)
itemRoutes.patch(
  '/:id',
  ensureAuthenticated,
  authorize([UserRole.ADMIN, UserRole.USER]),
  updateItemController
)
itemRoutes.delete(
  '/:id',
  ensureAuthenticated,
  authorize([UserRole.ADMIN, UserRole.USER]),
  deleteItemController
)

export { itemRoutes }
