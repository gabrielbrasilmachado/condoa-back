import { Router } from 'express'
import { authorize } from '../../auth/middlewares/authorize.middleware'
import { ensureAuthenticated } from '../../auth/middlewares/ensure-authenticated.middleware'
import { UserRole } from '../../user/enums/user-role.enum'
import { createAddressController } from '../controllers/create-address.controller'
import { deleteAddressController } from '../controllers/delete-address.controller'
import { getAddressByIdController } from '../controllers/get-address-by-id.controller'
import { listAddressesController } from '../controllers/list-addresses.controller'
import { updateAddressController } from '../controllers/update-address.controller'

const addressRoutes = Router()

addressRoutes.get(
  '/',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  listAddressesController
)
addressRoutes.post(
  '/',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  createAddressController
)
addressRoutes.get(
  '/:id',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  getAddressByIdController
)
addressRoutes.patch(
  '/:id',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  updateAddressController
)
addressRoutes.delete(
  '/:id',
  ensureAuthenticated,
  authorize(UserRole.ADMIN),
  deleteAddressController
)

export { addressRoutes }
