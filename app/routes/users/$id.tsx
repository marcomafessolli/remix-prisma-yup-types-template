import { useLoaderData, redirect, json, useActionData, Form } from 'remix'
import type { ActionFunction, LoaderFunction, HeadersFunction } from 'remix'

import { db } from '~/utils/db.server'
import type { User, UpdateUserActionResponse } from '~/models/user'

export let headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control') ?? '',
    Vary: loaderHeaders.get('Vary') ?? '',
  }
}

export let action: ActionFunction = async ({ request, params }) => {
  const method = request.method
  let id: number
  let queryUser: any

  try {
    id = Number(params.id)
    queryUser = await db.user.findUnique({
      where: { id },
    })
  } catch (e) {
    throw new Response('Not Found', {
      status: 404,
    })
  }

  const user = queryUser as User
  const data = await request.formData()

  const email = String(data.get('email'))
  const name = String(data.get('name'))

  const __method = data.get('__method')
  const actionMethod = String(__method || method)

  try {
    switch (actionMethod.toUpperCase()) {
      case 'DELETE':
        await user.delete()
        break
      case 'PUT':
        await user.update({ email, name })
        break
      default:
        return json({}, 405)
    }
  } catch (errors) {
    return json({ errors }, 422)
  }

  return json({}, { status: 301, headers: { Location: '/users' } })
}

export let loader: LoaderFunction = async ({ params }) => {
  const id: number = Number(params.id)

  const user = await db.user.findUnique({
    where: { id },
  })

  if (!user) {
    throw new Response('Not Found', {
      status: 404,
    })
  }

  return json(user, {
    headers: {
      'Cache-Control': `public, max-age=${60 * 5}, s-maxage=${60 * 60 * 24}`,
      Vary: 'Cookie',
    },
  })
}

export default function User() {
  const user = useLoaderData<User>()
  const data = useActionData<UpdateUserActionResponse>()
  const errors = data?.errors

  return (
    <div className='rounded-xl bg-gray-100 p-5'>
      <div>
        <h2 className='text-xl'>User Details:</h2>
        <h4 className='text-gray-500 text-sm'>Name: {user.name}</h4>
        <h4 className='text-gray-500 text-sm'>E-mail: {user.email}</h4>
      </div>

      <hr className='mt-5' />

      <h3 className='mt-5 mb-2 text-xl'>Edit User:</h3>

      <Form method='put' replace>
        <input type='hidden' name='__method' value='PUT' />
        <label htmlFor='name' className='mt-5 block py-1 text-sm text-gray-600'>
          Name:
        </label>
        <div>
          <input
            key={user.name}
            type='text'
            id='name'
            name='name'
            placeholder='Name'
            defaultValue={user.name || ''}
          />
          {errors?.name?.map((error) => (
            <p key={error} className='text-red-500 text-xs capitalize mt-1'>
              {error}
            </p>
          ))}
        </div>
        <label
          htmlFor='email'
          className='mt-5 block py-1 text-sm text-gray-600'
        >
          Email:
        </label>
        <div>
          <input
            key={user.email}
            type='email'
            id='email'
            placeholder='Email'
            name='email'
            defaultValue={user.email}
          />
          {errors?.email?.map((error) => (
            <p key={error} className='text-red-500 text-xs capitalize mt-1'>
              {error}
            </p>
          ))}
        </div>

        <button
          type='submit'
          className='mt-5 px-3 py-2 bg-purple-700 text-white rounded'
        >
          Submit
        </button>
      </Form>

      <Form method='delete' action={`/users/${user.id}`}>
        <input type='hidden' name='__method' value='DELETE' />
        <button
          type='submit'
          className='mt-2 px-3 py-2 bg-purple-700 text-white rounded'
        >
          Delete {`${user.name}`}
        </button>
      </Form>
    </div>
  )
}
