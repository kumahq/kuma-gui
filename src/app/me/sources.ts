import type { DataSourceResponse } from '@/app/application'

type Closeable = { close: () => void }

export type MeSource = DataSourceResponse<{
  pageSize: number
}>

export const sources = () => {
  return {
    '/me': async (_params = {}, source: Closeable) => {
      source.close()
      return Promise.resolve({ pageSize: 50 })
    },
  }
}
