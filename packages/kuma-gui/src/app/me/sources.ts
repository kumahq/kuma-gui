import merge from 'deepmerge'

import { defineSources } from '../application/services/data-source'

type Storage = {
  get: (key: string) => Promise<object>
  set: (key: string, value: object) => Promise<object>
}
export const sources = ({ get, set }: Storage) => {
  return defineSources({
    // retrieves both route and global app prefs and merges them
    // anything route specific overwriting anything global/app specific
    '/me/:route': async (params) => {
      const [app, route] = await Promise.all([
        get('/'),
        get(params.route),
      ])
      return merge(
        {
          params: {
            size: 50,
          },
        },
        app,
        route,
      )
    },
    '/me/:route/:data': async (params) => {
      const { global: useGlobal = false, ...json } = JSON.parse(params.data)
      const targetRoute = useGlobal ? '/' : params.route
      const res = merge<object>(await get(targetRoute), json)
      set(targetRoute, res)
    },
  })
}
