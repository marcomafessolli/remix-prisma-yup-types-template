import { json } from 'remix'
import { ValidationError } from 'yup'

export type ActionValidationErrors<T> = {
  [P in keyof T]?: string[]
}

export const parseToActionValidationErrors = <T>(
  errors: ValidationError,
): ActionValidationErrors<T> => {
  const validationErrors = errors.inner
  let form = {} as any

  for (const error of validationErrors) {
    const { path } = error
    form[path!] = error.errors
  }

  return form
}
