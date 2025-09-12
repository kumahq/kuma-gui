import createClient from 'openapi-fetch'

import { GlobalInsight } from './data'
import { defineSources } from '../application/services/data-source'
import type { DataSourceResponse, Env } from '@/app/application'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'
import type { paths } from '@kumahq/kuma-http-api'

export type ControlPlaneAddresses = {
  http: string
}

export type ControlPlaneAddressesSource = DataSourceResponse<ControlPlaneAddresses>

// mostly taken from semver-compare
export const compare = (a: string, b: string) => {
  const pa = a.split('.')
  const pb = b.split('.')
  for (let i = 0; i < 3; i++) {
    const na = Number(pa[i])
    const nb = Number(pb[i])
    if (na > nb) return 1
    if (nb > na) return -1
  }
  return 0
}
export const sources = (env: Env, api: KumaApi) => {
  const http = createClient<paths>({
    baseUrl: '',
    fetch: api.client.fetch,
  })

  return defineSources({
    '/control-plane/addresses': async (): Promise<ControlPlaneAddresses> => {
      return {
        http: env('KUMA_API_URL'),
      }
    },

    // used to figure out if the currently running zone control-plane
    // is out of date with the currently running GUI release
    '/control-plane/outdated/:version': async (params) => {
      // if the current version includes some sort of `-dev` then pretend we
      // are on the latest version and therefore not outdated
      if (!params.version.match('^[0-9]+.[0-9]+.[0-9]+$')) {
        return {
          version: env('KUMA_VERSION'),
          outdated: false,
        }
      }
      return {
        version: env('KUMA_VERSION'),
        outdated: compare(env('KUMA_VERSION'), params.version) === 1,
      }
    },

    // used to figure out if the currently running global control-plane
    // is out of date with the latest release
    '/control-plane/version/latest': async (): Promise<{ version: string }> => {
      const current = env('KUMA_VERSION')
      // if the current version includes some sort of `-dev` then pretend we
      // are on the latest version
      if (!current.match('^[0-9]+.[0-9]+.[0-9]+$')) {
        return {
          version: current,
        }
      }
      const version = await (async () => {
        try {
          return (await api.client.fetch(env('KUMA_VERSION_URL'))).json()
        } catch (e) {
          console.error(e)
          return ''
        }
      })()
      // compare the latest version to the currently running version but only
      // if we were able to get the latest version in the first place.
      // Otherwise pretend we are on the latest version
      return {
        version: (version !== '' && compare(version, current) === 1) ? version : current,
      }
    },

    '/config': async () => {
      return (await http.GET('/config')).data!
    },

    '/global-insight': async () => {
      const res = await http.GET('/global-insight')

      return GlobalInsight.fromObject(res.data!)
    },
  })
}
