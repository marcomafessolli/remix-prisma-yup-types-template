import { ValidationError, ObjectSchema, TypeOf, BaseSchema } from 'yup'

export type RequestValidationError = {
  path: string
  message: string
}

export const formatRequestErrors = (errors: ValidationError) => {
  return errors
}

export const validate = async <T>(object: T, schema: BaseSchema) => {
  try {
    return await schema.validate(object, { abortEarly: false })
  } catch (error) {
    console.log(error)
    const errors = formatRequestErrors(error as ValidationError)
    throw [...errors.inner]
  }
}
