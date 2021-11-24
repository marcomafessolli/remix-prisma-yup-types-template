import { object, string } from 'yup'
import { Prisma, PrismaClient } from '@prisma/client'

import UserForm from './form'

import { validate } from '../validator'

const schema = object().shape({
  name: string().required(),
  email: string().email().required(),
})

export const createUser = async (user: Prisma.UserCreateInput) => {
  try {
    await validate(user, schema)
    const prisma = new PrismaClient()

    const newUser = await prisma.user.create({
      data: user,
    })

    await prisma.$disconnect()
    return newUser
  } catch (errors) {
    throw errors
  }
}

export const updateUser = async (id: number, user: Prisma.UserUpdateInput) => {
  try {
    await validate(user, schema)
    const prisma = new PrismaClient()

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: user,
    })

    await prisma.$disconnect()
    return updatedUser
  } catch (errors) {
    console.log(errors)
    throw errors
  }
}

export const deleteUser = async (id: number) => {
  try {
    const prisma = new PrismaClient()

    const deletedUser = await prisma.user.delete({
      where: {
        id,
      },
    })

    await prisma.$disconnect()
    return deletedUser
  } catch (errors) {
    throw errors
  }
}

export { UserForm }
