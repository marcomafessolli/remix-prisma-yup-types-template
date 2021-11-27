import { useActionData, Form } from 'remix'
import type { ActionFunction, HeadersFunction } from 'remix'

import { db } from '~/utils/db.server'
import type { User } from '~/models/user'

import { resolve } from '~/utils/action.handler'
import type { ActionData } from '~/utils/action.handler'

export let headers: HeadersFunction = () => {
  return {
    'Cache-Control': `public, max-age=${60 * 10}, s-maxage=${
      60 * 60 * 24 * 30
    }`,
  }
}

export let action: ActionFunction = async ({ request, params }) => {
  const { req, res } = await resolve<User>(request, params)
  const { name, email } = req.body

  try {
    await db.user.create({ data: { email, name } })
  } catch (errors) {
    return res.send({ errors }, { status: 400 })
  }

  return res.send({ redirect: '/users' })
}

export default function New() {
  const actionResponse = useActionData<ActionData<User>>()
  const { errors } = actionResponse || {}

  return (
    <div className='rounded-xl bg-gray-100 p-5'>
      <h3 className='mb-2 text-xl'>Create new User:</h3>

      <Form method='post' replace noValidate>
        <label htmlFor='name' className='mt-5 block py-1 text-sm text-gray-600'>
          Name:
        </label>
        <div>
          <input type='text' id='name' placeholder='Name' name='name' />
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
          <input type='email' id='email' placeholder='Email' name='email' />
          {errors?.email?.map((error) => (
            <p key={error} className='text-red-500 text-xs capitalize mt-1'>
              {error}
            </p>
          ))}
        </div>

        <button
          type='submit'
          className='px-3 py-2 mt-5 bg-purple-700 text-white rounded'
        >
          Create New User
        </button>
      </Form>
    </div>
  )
}
