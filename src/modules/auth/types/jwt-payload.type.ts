import { type JwtPayload } from 'jsonwebtoken'
import { type AuthenticatedUser } from './authenticated-user.type'

export type AuthJwtPayload = JwtPayload &
  Partial<AuthenticatedUser> & {
    sub?: string
    sessionId?: string
  }
