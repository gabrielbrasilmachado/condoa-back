import { Router } from 'express'
import { addressRoutes } from '../../modules/address/routes/address.routes'
import { authRoutes } from '../../modules/auth/routes/auth.routes'
import { categoryRoutes } from '../../modules/category/routes/category.routes'
import { condominiumRoutes } from '../../modules/condominium/routes/condominium.routes'
import { condominiumRequestRoutes } from '../../modules/condominium-request/routes/condominium-request.routes'
import { itemRoutes } from '../../modules/item/routes/item.routes'
import { userRoutes } from '../../modules/user/routes/user.routes'

const router = Router()

router.get('/health', (_request, response) => {
  return response.status(200).json({ status: 'ok' })
})

router.use('/auth', authRoutes)
router.use('/addresses', addressRoutes)
router.use('/categories', categoryRoutes)
router.use('/condominiums', condominiumRoutes)
router.use('/condominium-requests', condominiumRequestRoutes)
router.use('/items', itemRoutes)
router.use('/users', userRoutes)

export { router }
