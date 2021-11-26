import { Params } from 'react-router'
import { json } from 'remix'

export type ActionRequestErrors<T> = {
  [P in keyof T]?: string[]
}

export type ActionRequestResponse<T> = {
  data?: any
  errors?: ActionRequestErrors<T>
  status?: number
  redirect?: string
}

type ActionResponse<T> = {
  send(data: any | ActionRequestResponse<T>): Promise<any>
}

export const REQUEST_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
}

type ActionRequestBody<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P]
}

type ActionRequest<T> = {
  method: keyof typeof REQUEST_METHOD
  body: ActionRequestBody<T, string | number | boolean | null>
  query(q: string): string | undefined
}

type CreateActionRequest<T> = {
  req: ActionRequest<T>
  res: ActionResponse<T>
}

export async function CreateActionRequest<T>(
  request: Request,
  params: Params,
): Promise<CreateActionRequest<T>> {
  const data = await request.formData()

  let body: any = {}

  for (const pair of data.entries()) {
    const [key, value] = pair
    body[key] = value
  }

  let method = (body['__method'] ?? request.method).toUpperCase()

  const actionRequest: ActionRequest<T> = {
    method,
    body,
    query(q) {
      return params[q]
    },
  }

  const actionResponse: ActionResponse<T> = {
    async send(data) {
      const { status, redirect, errors, data: content } = data

      const body = {
        data: content,
        errors,
      }

      const options = {
        status: status ?? 200,
      }

      if (!redirect) {
        return json(body, options)
      }

      const optionOverride = {
        status: status ?? 302,
        headers: {
          Location: redirect,
        },
      }

      return json(body, optionOverride)
    },
  }

  return {
    req: actionRequest,
    res: actionResponse,
  }
}
