import { useLoaderData, useActionData, Form } from 'remix'
import type { ActionFunction, LoaderFunction } from 'remix'

import { db } from '~/utils/db.server'
import type { User } from '~/models/user'

import { resolve } from '~/utils/action.handler'

import type { ActionData } from '~/utils/action.handler'
import type { LoaderData } from '~/utils/loader.handler'

export let action: ActionFunction = async ({ request, params }) => {
  const { req, res } = await resolve<User>(request, params)
  const id = req.query('id')

  let user: User

  try {
    user = (await db.user.findUnique({
      where: { id: Number(id) },
    })) as User
  } catch (e) {
    throw new Response('Not Found', {
      status: 404,
    })
  }

  const { name, email } = req.body

  try {
    switch (req.method) {
      case 'delete':
        await user.delete()
        break
      case 'put':
        await user.update({ email, name })
        break
      default:
        return res.send({ status: 405 })
    }
  } catch (errors) {
    return res.send({ errors, status: 422 })
  }

  return res.send({ redirect: '/users', status: 301 })
}

export let loader: LoaderFunction = async ({ request, params }) => {
  const { req, res } = await resolve<User>(request, params)
  const id = req.query('id')

  const user = await db.user.findUnique({
    where: { id: Number(id) },
  })

  if (!user) {
    throw new Response('Not Found', {
      status: 404,
    })
  }

  return res.send({ user })
}

export default function User() {
  const loaderResponse = useLoaderData<LoaderData<User>>()
  const actionResponse = useActionData<ActionData<User>>()

  const user = loaderResponse.user!
  const { errors } = actionResponse || {}

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

      <Form method='delete'>
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
