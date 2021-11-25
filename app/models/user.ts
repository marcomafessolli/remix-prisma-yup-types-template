import { object, string } from 'yup'

import { Prisma } from '@prisma/client'
import type { User as PrismaUser } from '@prisma/client'

import type { ActionValidationErrors } from '~/utils/validation-json-format'

import { db } from '~/utils/db.server'

const schema = object().shape({
  name: string().min(3).required(),
  email: string().email().required(),
})

const schemaOptions = {
  abortEarly: false,
}

export type User = PrismaUser

export type ActionUserUpdateErrors =
  ActionValidationErrors<Prisma.UserUpdateInput>

export type ActionUserCreateErrors =
  ActionValidationErrors<Prisma.UserCreateInput>

export const fetch = async () => {
  const users = await db.user.findMany()
  return users
}

export const find = async (id: number) => {
  id = Number(id)

  const user = await db.user.findUnique({
    where: {
      id,
    },
  })

  return user
}

export const create = async (data: Prisma.UserCreateInput) => {
  await schema.validate(data, schemaOptions)

  const user = await db.user.create({
    data,
  })

  return user
}

export const update = async (id: number, data: Prisma.UserUpdateInput) => {
  await schema.validate(data, schemaOptions)

  const user = await db.user.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  })

  return user
}

export const erase = async (id: number) => {
  id = Number(id)

  const user = await db.user.delete({
    where: {
      id,
    },
  })

  return user
}
