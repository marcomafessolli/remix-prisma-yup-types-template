import { Prisma } from '@prisma/client'
import type { User as PrismaUser } from '@prisma/client'

import { object, string } from 'yup'

import { validate } from '~/models/validation'
import { db } from '~/utils/db.server'

const schema = object().shape({
  name: string().min(3).required(),
  email: string().email().required(),
})

type UserMutations = {
  id?: number
  update(data: Prisma.UserUpdateInput): Promise<void>
  delete(): Promise<void>
}

export type User = UserMutations & PrismaUser

export const userMiddleware: Prisma.Middleware = async (params, next) => {
  if (params?.model !== 'User') {
    return next(params)
  }

  const { action } = params

  if (['create', 'update'].includes(action)) {
    const { data } = params?.args

    try {
      await validate(data, schema)
    } catch (error) {
      throw error
    }
  }

  const resolved = await next(params)

  const mutations: UserMutations = {
    async update(data: Prisma.UserUpdateInput) {
      await db.user.update({
        where: { id: this.id },
        data,
      })
    },
    async delete() {
      await db.user.delete({
        where: { id: this.id },
      })
    },
  }

  if (action === 'findMany') {
    const result = resolved.map((user: PrismaUser) => {
      return {
        ...user,
        ...mutations,
      }
    })

    return result
  }

  return {
    ...resolved,
    ...mutations,
  }
}
