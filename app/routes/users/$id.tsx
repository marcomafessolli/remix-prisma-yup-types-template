import { useLoaderData, redirect, json, useActionData, Form } from 'remix'

import type { ActionFunction, LoaderFunction } from 'remix'
import type { ValidationError } from 'yup'
import type { User } from '@prisma/client'

import { UserForm } from '~/components/user/form'

import { erase, update, find } from '~/models/user'

export const action: ActionFunction = async ({ request, params }) => {
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
    return json([...errors.inner], 422)
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  const id: number = Number(params.id)
  const user = await find(id)

  if (!user) {
    throw new Response('Not Found', {
      status: 404,
    })
  }

  return user
}

export default function User() {
  const user = useLoaderData<User>()
  const errors = useActionData<ValidationError[]>()

  return (
    <div>
      <h2>User Detail</h2>
      <div>
        <h3>{user.name}</h3>
        <h3>{user.email}</h3>
      </div>
      <br />

      <UserForm errors={errors} user={user} />

      <Form method='delete' action={`/users/${user.id}`}>
        <button type='submit' style={{ marginTop: '5px' }}>
          Delete {`${user.name}`}
        </button>
      </Form>
    </div>
  )
}
