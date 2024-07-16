import type { Source } from '@/app/application'
import { defineSources } from '@/app/application/services/data-source'
import { ApiError } from '@/app/kuma/services/kuma-api/ApiError'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import { ZoneOverview } from '@/app/zones/data'

/**
 * https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#rfc-1035-label-names
 */
const NAME_REGEX = /^(?![-0-9])[a-z0-9-]{1,63}$/

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
    '/zone-cps/~/create/:data': async (params) => {
      const { name } = JSON.parse(params.data)
      if (NAME_REGEX.test(name)) {
        const res = await api.createZone({ name })
        return {
          ...res,
          base64: window.btoa(res.token),
        }
      }
      throw new ApiError({
        status: 0,
        title: '',
        invalidParameters: [
          {
            field: 'name',
            reason: "The name must be a valid RFC 1035 DNS name, which means it must start with a letter, be less than 64 characters long, and only contain lowercase letters, numbers, and '-'.",
          },

        ],
      })
    },
    '/zone-cps/:name/validate': async (params) => {
      const { name } = params
      if (NAME_REGEX.test(name)) {
        return true
      }
      throw new ApiError({
        status: 0,
        title: '',
        invalidParameters: [
          {
            field: 'name',
            reason: "The name must be a valid RFC 1035 DNS name, which means it must start with a letter, be less than 64 characters long, and only contain lowercase letters, numbers, and '-'.",
          },

        ],
      })
    },
    '/zone-cps/:name/delete/:data': async (params) => {
      const { name } = params
      return api.deleteZone({ name })
    },
  })
}
