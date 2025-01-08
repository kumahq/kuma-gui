import merge from 'deepmerge'

import { defineSources } from '../application/services/data-source'

export const sources = (prefix: string = 'me', storage: Storage = window.localStorage) => {
  const get = async (key: string): Promise<object> => {
    try {
      return JSON.parse(storage.getItem(`${prefix}:${key}`) ?? '{}')
    } catch (e) {
      console.error(e)
    }
    return {}
  }
  const set = async (key: string, value: object): Promise<object> => {
    try {
      storage.setItem(`${prefix}:${key}`, JSON.stringify(value))
      return value
    } catch (e) {
      console.error(e)
    }
    return {}
  }
  return defineSources({
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
      const res = merge<Record<string, unknown>>(await get(params.route), json)

      set(params.route, res)
    },
  })
}
