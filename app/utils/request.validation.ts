import type { BaseSchema, ValidationError as Error } from 'yup'

export type ActionValidationErrors<T> = {
  [P in keyof T]?: string[]
}

const formatErrors = (errors: Error) => {
  const validationErrors = errors.inner
  let form = {} as any

  for (const error of validationErrors) {
    const { path } = error
    form[path!] = error.errors
  }

  return form
}

export const validateActionInputData = async <T>(
  data: T,
  schema: BaseSchema,
) => {
  try {
    await schema.validate(data, { abortEarly: false })
  } catch (errors) {
    const actionValidationErrors = formatErrors(errors as Error)
    throw actionValidationErrors
  }
}
