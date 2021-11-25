import { useLoaderData, Outlet, Link } from 'remix'

import type { LoaderFunction } from 'remix'
import type { User } from '@prisma/client'

import { fetch } from '~/models/user'

export let loader: LoaderFunction = async () => {
  const users = await fetch()
  return users
}

export default function Users() {
  const users = useLoaderData<User[]>()

  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id} style={{ padding: '5px 0 5px' }}>
            <Link to={`${user.id}`}>
              {user.name} - {user.email}
            </Link>
          </li>
        ))}
      </ul>

      <Link to='/users/new'>Create</Link>
      <Outlet />
    </div>
  )
}
