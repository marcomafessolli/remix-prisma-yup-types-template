import { useLoaderData, Outlet, Link, Form } from 'remix'
import type { LoaderFunction } from 'remix'

import { PrismaClient } from '@prisma/client'
import type { User } from '@prisma/client'

export let loader: LoaderFunction = async () => {
  const prisma = new PrismaClient()
  const users = await prisma.user.findMany()

  prisma.$disconnect()
  return users
}

export default function Users() {
  const users: User[] = useLoaderData()

  return (
    <div>
      <h1>Users</h1>

      <ul>
        {users.map((user) => (
          <li key={user.id} style={{ padding: '5px 0 5px' }}>
            <Link to={`${user.id}`} reloadDocument>
              {user.name} - {user.email}
            </Link>
          </li>
        ))}
      </ul>

      <Link to='/users/create'>Create</Link>

      <div>
        <Outlet />
      </div>
    </div>
  )
}
