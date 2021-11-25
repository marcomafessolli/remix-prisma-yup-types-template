import { useActionData, json, redirect, Form } from 'remix'
import type { ActionFunction, HeadersFunction } from 'remix'

import type { ValidationError } from 'yup'

import { create } from '~/models/user'
import type { ActionUserCreateErrors } from '~/models/user'

import { parseToActionValidationErrors } from '~/utils/validation-json-format'

export let headers: HeadersFunction = () => {
  return {
    'Cache-Control': `public, max-age=${60 * 10}, s-maxage=${
      60 * 60 * 24 * 30
    }`,
  }
}

export let action: ActionFunction = async ({ request }) => {
  const data = await request.formData()
  const email = String(data.get('email'))
  const name = String(data.get('name'))

  try {
    await create({ email, name })
    return redirect('/users/')
  } catch (e) {
    const errors = e as ValidationError
    const actionErrors = parseToActionValidationErrors(errors)

    return json(actionErrors, 422)
  }
}

export default function New() {
  const errors = useActionData<ActionUserCreateErrors>()

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
