import { useLoaderData, Outlet, Link } from 'remix'
import type { LoaderFunction } from 'remix'

import { db } from '~/utils/db.server'
import type { User } from '~/models/user'

export let loader: LoaderFunction = async () => {
  const users = await db.user.findMany()
  return users
}

export default function Users() {
  const users = useLoaderData<User[]>()

  return (
    <div>
      <h2 className='text-xl'>Users:</h2>

      <ul className='pt-2 pb-5'>
        {users?.map((user) => (
          <li key={user.id}>
            <Link
              to={`${user.id}`}
              prefetch='intent'
              className='text-sm text-gray-500'
            >
              User: {user.name} - {user.email}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to='/users/new'
        className='px-3 py-2 bg-purple-700 text-white rounded'
      >
        Create New User
      </Link>

      <div className='mt-5'>
        <Outlet />
      </div>
    </div>
  )
}
