import { type AuthenticatedUser } from '../../modules/auth/types/authenticated-user.type'

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
    }
  }
}

export {}
