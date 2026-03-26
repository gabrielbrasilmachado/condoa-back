import { Router } from 'express'
import { authorize } from '../../auth/middlewares/authorize.middleware'
import { ensureAuthenticated } from '../../auth/middlewares/ensure-authenticated.middleware'
import { UserRole } from '../../user/enums/user-role.enum'
import { approveCondominiumRequestController } from '../controllers/approve-condominium-request.controller'
import { createCondominiumRequestController } from '../controllers/create-condominium-request.controller'
import { getCondominiumRequestByIdController } from '../controllers/get-condominium-request-by-id.controller'
import {
  listCondominiumRequestsController,
  listOwnCondominiumRequestsController,
} from '../controllers/list-condominium-requests.controller'
import { rejectCondominiumRequestController } from '../controllers/reject-condominium-request.controller'

const condominiumRequestRoutes = Router()

condominiumRequestRoutes.post(
  '/',
  ensureAuthenticated,
  authorize([UserRole.ADMIN, UserRole.USER]),
  createCondominiumRequestController
)
condominiumRequestRoutes.get(
  '/me',
  ensureAuthenticated,
  authorize([UserRole.ADMIN, UserRole.USER]),
  listOwnCondominiumRequestsController
)
condominiumRequestRoutes.get(
  '/',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  listCondominiumRequestsController
)
condominiumRequestRoutes.patch(
  '/:id/approve',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  approveCondominiumRequestController
)
condominiumRequestRoutes.patch(
  '/:id/reject',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  rejectCondominiumRequestController
)
condominiumRequestRoutes.get(
  '/:id',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  getCondominiumRequestByIdController
)

export { condominiumRequestRoutes }
