import { useLoaderData, redirect, json, useActionData, Form } from 'remix'
import { PrismaClient } from '@prisma/client'

import { UserForm, updateUser, deleteUser } from '~/components/user'

export async function action({ request, params }) {
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

  switch (method) {
    case 'DELETE':
      try {
        await deleteUser(id)
        return redirect('/users/')
      } catch (errors) {
        return json(errors, 422)
      }

    case 'POST':
      return redirect(`/users/${id}`)

    case 'PUT':
      try {
        await updateUser(id, { email, name })
        return redirect(`/users/${id}`)
      } catch (errors) {
        return json(errors, 422)
      }
  }
}

export async function loader({ params }) {
  const id: number = Number(params.id)
  const prisma = new PrismaClient()

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })

  prisma.$disconnect()

  if (!user) {
    throw new Response('Not Found', {
      status: 404,
    })
  }

  return user
}

export default function User() {
  const user = useLoaderData()
  const errors = useActionData()

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
