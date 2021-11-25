import { PrismaClient } from '@prisma/client'
import { middlewareHooks } from '~/models'

const attachMiddleware = (db: PrismaClient) => {
  for (const hook of middlewareHooks) {
    db.$use(async (params, next) => {
      return hook(params, next)
    })
  }
}

let db: PrismaClient
declare global {
  var __db: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient()
  attachMiddleware(db)

  db.$connect()
} else {
  if (!global.__db) {
    global.__db = new PrismaClient()
    attachMiddleware(global.__db)

    global.__db.$connect()
  }

  db = global.__db
}

export { db }
