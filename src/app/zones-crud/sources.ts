import type { Source } from '@/app/application'
import { defineSources } from '@/app/application/services/data-source'
import { ZoneOverview } from '@/app/zones/data'
import type KumaApi from '@/services/kuma-api/KumaApi'

export const sources = (source: Source, api: KumaApi) => {
  return defineSources({
    '/zone-cps/online/:name': (params) => {
      const ZoneOfflineError = class extends Error { }
      const { name } = params
      return source(async () => {
        const res = ZoneOverview.fromObject(await api.getZoneOverview({ name }))
        // anything but online, retry
        if (res.state === 'online') {
          return res
        } else {
          throw new ZoneOfflineError()
        }
      }, {
        retry: (e) => {
          if (e instanceof ZoneOfflineError) {
            return new Promise((resolve) => setTimeout(resolve, 2000))
          }
        },
      })
    },
  })
}
