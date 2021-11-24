import { useActionData, json, redirect } from 'remix'
import type { ActionFunction } from 'remix'

import { UserForm, createUser } from '~/components/user'

export let action: ActionFunction = async ({ request }) => {
  const data = await request.formData()

  const email = String(data.get('email'))
  const name = String(data.get('name'))

  try {
    await createUser({ email, name })
    return redirect('/users/')
  } catch (errors) {
    return json(errors, 422)
  }
}

export default function Create() {
  const errors = useActionData()
  return <UserForm errors={errors} />
}
