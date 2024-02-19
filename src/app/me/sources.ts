import { defineSources } from '../application/services/data-source'
import type { DataSourceResponse } from '@/app/application'

export type MeSource = DataSourceResponse<{
  pageSize: number
}>

export const sources = () => {
  return defineSources({
    '/me': async () => {
      return Promise.resolve({ pageSize: 50 })
    },
  })
}
