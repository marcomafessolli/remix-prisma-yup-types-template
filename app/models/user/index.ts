export * from './user.prisma.db'

import { Prisma } from '@prisma/client'
import type { RequestValidationErrors as ActionError } from '~/utils/request.validation'

export type UpdateUserActionResponse = {
  data?: any
  errors?: ActionError<Prisma.UserUpdateInput>
}

export type CreateUserActionResponse = {
  errors?: ActionError<Prisma.UserUpdateInput>
  data?: any
}
