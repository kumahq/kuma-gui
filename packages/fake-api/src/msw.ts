import { http, HttpResponse, passthrough } from 'msw'

import { createFetch } from './index.ts'
import type { Dependencies, FS, MockEndpoint } from './index.ts'

export const server = <TDependencies extends object = {}>(
  mock: MockEndpoint<TDependencies>,
  options: {
    params?: Record<string, string>
  },
  dependencies: Dependencies<TDependencies>,
) => {
  return async (env: Record<string, string>) => {

    dependencies.env = (key: keyof typeof env, d = '') => {
      return env[key] ?? d
    }

    const route = Object.keys(options.params ?? {}).reduce((prev, item) => {
      return `${prev}:${item}/`
    }, 'http://localhost/')
    const path = Object.values(options.params ?? {}).reduce((prev, item) => {
      return `${prev}${item}/`
    }, 'http://localhost/')

    const fetch = createFetch({
      dependencies,
      fs: {
        [route]: mock,
      },
    })
    const response = await fetch(path, {
      method: 'GET',
    })
    return response.json()
  }
}

export const handler = <TDependencies extends object = {}>(fs: FS, dependencies: Dependencies<TDependencies>) => {
  const fetch = createFetch({
    dependencies,
    fs,
  })
  return (route: string) => {
    return http.all(`${route}`, async ({ request: req }) => {
      // headers can be string | string[] | undefined, not string
      const headers = Object.entries(req.headers).reduce((prev, [key, item]) => {
        if (typeof item !== 'undefined') {
          prev[key] = Array.isArray(item) ? item[0] : item
        }
        return prev
      }, {} as Record<string, string>)
      const response = await fetch(`${req.url ?? ''}`, {
        method: req.method,
        headers,
        body: req.body ? JSON.parse(await new Response(req.body).text() || '{}') : {},
      })
      const latency = parseInt(dependencies.env('KUMA_LATENCY', '0'))
      if (latency !== 0) {
        await new Promise(resolve => setTimeout(resolve, latency))
      }
      if (typeof response === 'undefined') {
        return passthrough()
      }
      return HttpResponse.json((await response.json()), {
        status: parseInt(response.headers?.get('Status-Code') ?? '200'),
      })
    })
  }
}

export const mswHandlers = <TDependencies extends object = {}>(fs: FS, dependencies: Dependencies<TDependencies>) => {
  const baseUrl = dependencies.env('KUMA_API_URL')
  const _fs = Object.fromEntries(Object.entries(fs).map(([route, response]) => {
    return [route.includes('://') ? route : `${baseUrl}${route}`, response]
  }))
  const handlerFor = handler(_fs, dependencies)
  return Object.keys(_fs).map(route => {
    return handlerFor(route)
  })
}
