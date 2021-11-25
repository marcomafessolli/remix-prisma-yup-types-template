import { useLoaderData, redirect, json, useActionData, Form } from 'remix'
import type { ActionFunction, LoaderFunction, HeadersFunction } from 'remix'

import type { ValidationError } from 'yup'

import { erase, update, find } from '~/models/user'
import type { ActionUserUpdateErrors, User } from '~/models/user'

import { parseToActionValidationErrors } from '~/utils/validation-json-format'

export let headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control') ?? '',
    Vary: loaderHeaders.get('Vary') ?? '',
  }
}

export let action: ActionFunction = async ({ request, params }) => {
  const method = request.method
  const id: number = Number(params.id)

  if (!id) {
    throw new Response('Not Found', {
      status: 404,
    })
  }

  const data = await request.formData()
  const email = String(data.get('email'))
  const name = String(data.get('name'))

  try {
    switch (method) {
      case 'DELETE':
        await erase(id)
        return redirect('/users/')

      case 'POST':
        return redirect(`/users/${id}`)

      case 'PUT':
        await update(id, { email, name })
        return redirect(`/users/${id}`)
    }
  } catch (e) {
    const errors = e as ValidationError
    const actionErrors = parseToActionValidationErrors(errors)

    return json(actionErrors, 422)
  }
}

export let loader: LoaderFunction = async ({ params }) => {
  const id: number = Number(params.id)
  const user = await find(id)

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
  const errors = useActionData<ActionUserUpdateErrors>()

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
        <label htmlFor='name' className='mt-5 block py-1 text-sm text-gray-600'>
          Name:
        </label>
        <div>
          {user.name && (
            <input
              key={user.name}
              type='text'
              id='name'
              name='name'
              defaultValue={user.name}
            />
          )}
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
