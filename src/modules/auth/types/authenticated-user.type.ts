import { UserRole } from '../../user/enums/user-role.enum'

export type AuthenticatedUser = {
  id: string
  role: UserRole
}
