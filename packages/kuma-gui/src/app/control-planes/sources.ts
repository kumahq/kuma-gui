import createClient from 'openapi-fetch'

import { GlobalInsight } from './data'
import { defineSources } from '@/app/application'
import type { paths } from '@kumahq/kuma-http-api'

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

type Options = {
  baseUrl: string
  versionUrl: string
  version: string
  fetch: typeof fetch
}

export const sources = ({ fetch, baseUrl, versionUrl, version }: Options) => {
  const http = createClient<paths>({
    baseUrl,
    fetch,
  })

  return defineSources({
    '/control-plane/addresses': async () => {
      return {
        http: baseUrl,
      }
    },

    // used to figure out if the currently running zone control-plane
    // is out of date with the currently running GUI release
    '/control-plane/outdated/:version': async (params) => {
      // if the current version includes some sort of `-dev` then pretend we
      // are on the latest version and therefore not outdated
      if (!params.version.match('^[0-9]+.[0-9]+.[0-9]+$')) {
        return {
          version,
          outdated: false,
        }
      }
      return {
        version,
        outdated: compare(version, params.version) === 1,
      }
    },

    // used to figure out if the currently running global control-plane
    // is out of date with the latest release
    '/control-plane/version/latest': async (): Promise<{ version: string }> => {
      const local = version
      // if the current version includes some sort of `-dev` then pretend we
      // are on the latest version
      if (!local.match('^[0-9]+.[0-9]+.[0-9]+$')) {
        return {
          version: local,
        }
      }
      const remote = await (async () => {
        try {
          const url = new URL(versionUrl)
          // @ts-expect-error we allow any pathname here
          const res = await http.GET(url.pathname, {
            baseUrl: url.origin,
            parseAs: 'text',
          })
          return res.data ?? ''
        } catch (e) {
          console.error(e)
          return ''
        }
      })()
      // compare the latest version to the currently running version but only
      // if we were able to get the latest version in the first place.
      // Otherwise pretend we are on the latest version
      return {
        version: (remote !== '' && compare(remote, local) === 1) ? remote : local,
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
