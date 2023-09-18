import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'

type Closeable = { close: () => void }

export type MeSource = DataSourceResponse<{
  pageSize: number
}>

export const sources = () => {
  return {
    '/me': async (_params = {}, source: Closeable) => {
      source.close()
      return { pageSize: 50 }
    },
  }
}
