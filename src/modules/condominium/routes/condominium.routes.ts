import { Router } from 'express'
import { authorize } from '../../auth/middlewares/authorize.middleware'
import { ensureAuthenticated } from '../../auth/middlewares/ensure-authenticated.middleware'
import { UserRole } from '../../user/enums/user-role.enum'
import { createCondominiumController } from '../controllers/create-condominium.controller'
import { deleteCondominiumController } from '../controllers/delete-condominium.controller'
import { getCondominiumByIdController } from '../controllers/get-condominium-by-id.controller'
import { listCondominiumsController } from '../controllers/list-condominiums.controller'
import { updateCondominiumController } from '../controllers/update-condominium.controller'

const condominiumRoutes = Router()

condominiumRoutes.get(
  '/',
  ensureAuthenticated,
  authorize([UserRole.ADMIN, UserRole.USER]),
  listCondominiumsController
)
condominiumRoutes.post(
  '/',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  createCondominiumController
)
condominiumRoutes.get(
  '/:id',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  getCondominiumByIdController
)
condominiumRoutes.patch(
  '/:id',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  updateCondominiumController
)
condominiumRoutes.delete(
  '/:id',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  deleteCondominiumController
)

export { condominiumRoutes }
