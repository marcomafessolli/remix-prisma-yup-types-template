import { Params } from 'react-router'
import { json } from 'remix'

import type { ModelValidationErrors } from '~/models/validation'
import type { APP_MODELS } from '~/models/models'

type ActionModel<T> = {
  [P in APP_MODELS as string]?: T
}

export type ActionData<T> = ActionModel<T> & {
  errors?: ModelValidationErrors<T>
}

type ActionResponseConfiguration = {
  status?: number
  redirect?: string
  headers?: { [key: string]: string }
}

type ActionResponsePayload<T> = {
  [P: string]: T | ActionResponseConfiguration | any
  errors?: any
}

type ActionRequestMethods = 'get' | 'post' | 'put' | 'patch' | 'delete'

type ActionRequestBody<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P]
}

type ActionRequest<T> = {
  readonly method: ActionRequestMethods
  readonly body: ActionRequestBody<T, string | number | boolean | null>
  query(q: string): string | undefined
}

function resolveResponse<T>() {
  return {
    send(
      payload?: ActionResponsePayload<T>,
      config?: ActionResponseConfiguration,
    ) {
      const {
        status = 200,
        redirect,
        errors = [],
        ...payloadRest
      } = payload || {}

      let configuration: ActionResponseConfiguration = {
        status,
        redirect,
        ...config,
      }

      if (configuration?.redirect) {
        configuration = {
          headers: {
            Location: configuration.redirect,
          },
          ...configuration,
        }
      }

      const models = Object.keys(payloadRest)
        .map((key) => {
          const name = key as APP_MODELS
          const values = payloadRest[key] as T

          return {
            [name]: values,
          }
        })
        .reduce((acc, curr) => ({ ...acc, ...curr }), {})

      return json({ ...models, errors }, configuration)
    },
  }
}

async function resolveRequest<T>(req: Request, params: Params) {
  const data = await req.formData()

  let body: any = {}

  for (const pair of data.entries()) {
    const [key, value] = pair
    body[key] = value
  }

  const method = String(
    body['__method'] ?? req.method,
  ).toLowerCase() as ActionRequestMethods

  const request: ActionRequest<T> = {
    method,
    body,
    query(q) {
      return params?.[q]
    },
  }

  return request
}

export async function resolve<T>(request: Request, params: Params) {
  const req = await resolveRequest<T>(request, params)
  const res = resolveResponse<T>()

  return {
    req,
    res,
  }
}
