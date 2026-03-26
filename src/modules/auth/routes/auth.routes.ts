import { Router } from 'express'
import { authTestController } from '../controllers/auth-test.controller'
import { loginController } from '../controllers/login.controller'
import { logoutController } from '../controllers/logout.controller'
import { refreshTokenController } from '../controllers/refresh-token.controller'
import { ensureAuthenticated } from '../middlewares/ensure-authenticated.middleware'

const authRoutes = Router()

authRoutes.post('/login', loginController)
authRoutes.post('/refresh', refreshTokenController)
authRoutes.post('/logout', logoutController)
authRoutes.get('/me', ensureAuthenticated, authTestController)

export { authRoutes }
