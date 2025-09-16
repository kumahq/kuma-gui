import { token } from '@kumahq/container'
import { fs } from '@kumahq/kuma-http-api/mocks'

import type { Env } from '@/app/application'
import type { ServiceDefinition, Token } from '@kumahq/container'


const $ = {
  kumaFS: token<typeof fs>('fake.fs.kuma'),
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => [
  [token('kuma.locales.debug'), {
    service: () => {
      return {
        common: {
          product: {
            docs: 'https://kuma.io/docs/dev',
          },
        },
      }
    },
    labels: [
      // in Cypress this token doesn't exist
      app.enUs ?? token(''),
    ],
  }],

  [token('kuma.env.vars'), {
    service: () => {
      return {
        KUMA_MOCK_API_ENABLED: () => 'true',
      }
    },
    labels: [
      app.vars,
    ],
  }],
  [$.kumaFS, {
    service: (env: Env) => {
      // return fs
      const baseURL = env('KUMA_API_URL')
      return Object.fromEntries(Object.entries(fs).map(([route, response]) => {
        return [route.includes('://') ? route : `${baseURL}${route}`, response]
      }))
    },
    arguments: [
      app.env,
    ],
    labels: [
      app.fakeFS,
    ],
  }],
]
export const TOKENS = $
