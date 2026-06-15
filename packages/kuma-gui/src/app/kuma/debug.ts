import { token } from '@kumahq/container'
import { addOrigin } from '@kumahq/fake-api'
import { fs, remote } from '@kumahq/kuma-http-api/mocks'

import type { Env } from '@/app/application'
import type { ServiceDefinition, Token } from '@kumahq/container'


const $ = {
  remoteFS: token<typeof remote>('fake.fs.remote'),
  kumaFS: token<typeof fs>('fake.fs.kuma'),
}

export const locales = (app: Record<string, Token>): ServiceDefinition[] => [
  [token('kuma.locales.debug'), {
    service: () => {
      return {
        common: {
          product: {
            // ensure all variables in kuma/locales/en.us/index.yaml are also
            // used here
            docs: 'https://kuma.io/docs/dev{ major, select, other {}}{ minor, select, other {}}',
          },
        },
      }
    },
    labels: [
      // in Cypress this token doesn't exist
      app.enUs ?? token(''),
    ],
  }],
]
export const services = (app: Record<string, Token>): ServiceDefinition[] => [
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
  [$.remoteFS, {
    service: () => addOrigin(remote, 'https://kuma.io'),
    labels: [
      app.fakeFS,
    ],
  }],
  [$.kumaFS, {
    service: (env: Env) => addOrigin(fs, env('KUMA_API_URL')),
    arguments: [
      app.env,
    ],
    labels: [
      app.fakeFS,
    ],
  }],
]
export const TOKENS = $
