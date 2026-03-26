import { Router } from 'express'
import { authorize } from '../../auth/middlewares/authorize.middleware'
import { ensureAuthenticated } from '../../auth/middlewares/ensure-authenticated.middleware'
import { ensureOwnResource } from '../../auth/middlewares/ensure-own-resource.middleware'
import { adminUpdateUserController } from '../controllers/admin-update-user.controller'
import { createUserController } from '../controllers/create-user.controller'
import { deactivateOwnProfileController } from '../controllers/deactivate-own-profile.controller'
import { getUserByIdController } from '../controllers/get-user-by-id.controller'
import { listUsersController } from '../controllers/list-users.controller'
import { updateOwnProfileController } from '../controllers/update-own-profile.controller'
import { updateUserStatusController } from '../controllers/update-user-status.controller'
import { UserRole } from '../enums/user-role.enum'

const userRoutes = Router()

const ensureOwnUserProfile = ensureOwnResource({
  resolveOwnerId: (request) => request.params.id,
  forbiddenMessage: 'Você não tem permissão para acessar este perfil.',
})

userRoutes.get(
  '/',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  listUsersController
)
userRoutes.post('/', createUserController)
userRoutes.get(
  '/:id',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  getUserByIdController
)
userRoutes.patch(
  '/:id',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  adminUpdateUserController
)
userRoutes.patch(
  '/:id/profile',
  ensureAuthenticated,
  ensureOwnUserProfile,
  updateOwnProfileController
)
userRoutes.patch(
  '/:id/deactivate',
  ensureAuthenticated,
  ensureOwnUserProfile,
  deactivateOwnProfileController
)
userRoutes.patch(
  '/:id/status',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  updateUserStatusController
)

export { userRoutes }
