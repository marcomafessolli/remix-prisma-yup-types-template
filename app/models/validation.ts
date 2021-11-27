import type { BaseSchema, ValidationError as Error } from 'yup'

export type ModelValidationErrors<T> = {
  [P in keyof T]?: string[]
}

const formatModelValidationErrors = (errors: Error) => {
  const validationErrors = errors.inner
  let modelErrors = {} as any

  for (const error of validationErrors) {
    const { path } = error
    modelErrors[path!] = error.errors
  }

  return modelErrors
}

export const validate = async <T>(data: T, schema: BaseSchema) => {
  try {
    await schema.validate(data, { abortEarly: false })
  } catch (errors) {
    const actionValidationErrors = formatModelValidationErrors(errors as Error)
    throw actionValidationErrors
  }
}
