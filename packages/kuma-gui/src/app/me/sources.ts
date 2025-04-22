import merge from 'deepmerge'

import { defineSources } from '../application/services/data-source'

type Storage = {
  get: (key: string, d?: object) => Promise<[]>
  set: (key: string, value: object) => Promise<[]>
}

type Notification = {
  timestamp: number
  uri: string
}
const DAYS = 1000 * 60 * 24
export const sources = ({ get, set }: Storage) => {
  return defineSources({
    // used for saving dismissed notification id's
    '/me/~notifications': async () => {
      const dismissed: Notification[] = await get('~notifications', [])
      const current = dismissed.filter(item => {
        return (item.timestamp + (7 * DAYS)) > Date.now()
      })
      if(dismissed.length !== current.length) {
        await set('~notifications', current)
      }
      const res = current.map(item => item.uri)
      return res
    },
    '/me/~notifications/dismiss/:data': async (params) => {
      const dismissed: string[] = JSON.parse(params.data)
      const res = merge<object>(await get('~notifications', []), dismissed.map(item => ({
        timestamp: Date.now(),
        uri: item,
      })))
      await set('~notifications', res)
      return
    },
    '/me/~notifications/reset/:data': async (params) => {
      const reset = new Set<string>(JSON.parse(params.data))
      const dismissed = new Set<string>(await get('~notifications', []))
      await set('~notifications', Array.from(reset.difference(dismissed)))
      return
    },
    //

    // used for global and per route preferences
    // retrieves both route and global app prefs and merges them
    // anything route specific overwriting anything global/app specific
    '/me/:route': async (params) => {
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
              output: 'structured',
            },
          },
          app,
          route,
        ],
      )
    },
    '/me/:route/:data': async (params) => {
      const { $global, ...json } = JSON.parse(params.data)
      const targetRoute = $global ? '/' : params.route
      const res = merge<object>(await get(targetRoute), json)
      set(targetRoute, res)
    },
  })
}
