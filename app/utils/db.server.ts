import { PrismaClient } from '@prisma/client'
import { middlewareHooks } from '~/models'

const db = new PrismaClient()
db.$connect()

for (const hook of middlewareHooks) {
  db.$use(async (params, next) => {
    return hook(params, next)
  })
}

export { db }
