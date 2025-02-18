import merge from 'deepmerge'

import { defineSources } from '../application/services/data-source'

type Storage = {
  get: (key: string, d?: object) => Promise<object>
  set: (key: string, value: object) => Promise<object>
}
export const sources = ({ get, set }: Storage) => {
  return defineSources({
    // retrieves both route and global app prefs and merges them
    // anything route specific overwriting anything global/app specific
    '/me/:route': async (params) => {
      if(params.route.startsWith('~')) {
        return get(params.route, [])

      }
      const [app, route] = await Promise.all([
        get('/'),
        get(params.route),
      ])

      return merge.all(
        [
          {
            params: {
              size: 50,
              format: 'structured',
              inactive: false,
              includeEds: false,
            },
          },
          app,
          route,
        ],
      )
    },
    '/me/:route/:data': async (params) => {
      const data = JSON.parse(params.data)
      let targetRoute = params.route
      let json = data
      if(!Array.isArray(data)) {
        const { $global, ..._json } = data
        if($global) {
          targetRoute = '/'
        }
        json = _json
      }
      const res = merge<object>(await get(targetRoute, []), json)
      set(targetRoute, res)
    },
  })
}
