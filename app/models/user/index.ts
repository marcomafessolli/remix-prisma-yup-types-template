export * from './user.prisma.db'

import { Prisma } from '@prisma/client'
import type { ActionValidationErrors as ActionError } from '~/utils/action.form.validation'

export type UpdateUserActionResponse = {
  data?: any
  errors?: ActionError<Prisma.UserUpdateInput>
}

export type CreateUserActionResponse = {
  errors?: ActionError<Prisma.UserUpdateInput>
  data?: any
}
