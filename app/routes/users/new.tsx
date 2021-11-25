import { useActionData, json, redirect } from 'remix'
import type { ActionFunction } from 'remix'

import { UserForm } from '~/components/user/form'
import type { ValidationError } from 'yup'

import { create } from '~/models/user'

export let action: ActionFunction = async ({ request }) => {
  const data = await request.formData()

  const email = String(data.get('email'))
  const name = String(data.get('name'))

  try {
    await create({ email, name })
    return redirect('/users/')
  } catch (e) {
    const errors = e as ValidationError
    return json([...errors.inner], 422)
  }
}

export default function New() {
  const errors = useActionData<ValidationError[]>()
  return <UserForm errors={errors} />
}
