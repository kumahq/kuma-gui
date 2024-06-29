import merge from 'deepmerge'

import { defineSources } from '../application/services/data-source'
import type { DataSourceResponse } from '@/app/application'

export type MeSource = DataSourceResponse<{
  pageSize: number
  headers: Record<string, { width: number }>
}>

export const sources = (_api: unknown, storage: Storage = window.localStorage) => {
  const prefix = 'kumahq.kuma-gui'
  const get = async (key: string): Promise<Object> => {
    try {
      return JSON.parse(storage.getItem(`${prefix}:${key}`) ?? '{}')
    } catch (e) {
      console.error(e)
    }
    return {}
  }
  const set = async (key: string, value: Object): Promise<Object> => {
    try {
      storage.setItem(`${prefix}:${key}`, JSON.stringify(value))
      return value
    } catch (e) {
      console.error(e)
    }
    return {}
  }
  return defineSources({
    '/me': async () => {
      return Promise.resolve({ pageSize: 50 })
    },
    '/me/:route': async (params) => {
      const json = await get(params.route)
      const res = merge({
        params: {
          size: 50,
        },
      }, json)
      return res
    },
    '/me/:route/:data': async (params) => {
      const json = JSON.parse(params.data)
      const res = merge(await get(params.route), json)

      set(params.route, res)
    },
  })
}
