import type { APP_MODELS } from '~/models/models'

export type LoaderData<T> = {
  [P in APP_MODELS as string]?: T
}
