import { Form } from 'remix'

import type { ValidationError } from 'yup'
import type { User } from '@prisma/client'

export function UserForm({
  errors,
  user,
}: {
  errors?: ValidationError[]
  user?: User
}) {
  return (
    <Form method={user ? 'put' : 'post'} replace>
      {errors && (
        <div>
          <p>Error</p>
          <ul>
            {errors?.map?.((error) => {
              return error.errors.map((fieldError, index) => (
                <li key={`${error.name}${index}`}>{fieldError}</li>
              ))
            })}
          </ul>
        </div>
      )}

      <label htmlFor='name'>Name</label>
      <div>
        <input
          type='text'
          id='name'
          placeholder='name'
          name='name'
          defaultValue={user?.name || ''}
        />
      </div>
      <label htmlFor='email'>Email</label>
      <div>
        <input
          type='email'
          id='email'
          placeholder='email'
          name='email'
          defaultValue={user?.email}
        />
      </div>
      <br />
      <button type='submit'>Submit</button>
    </Form>
  )
}
