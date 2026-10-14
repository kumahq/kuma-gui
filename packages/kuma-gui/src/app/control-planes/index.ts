import { token, createInjections } from '@kumahq/container'

import { features } from './features'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import ControlPlaneActionGroup from '@/app/control-planes/components/ControlPlaneActionGroup.vue'
import ControlPlaneStatus from '@/app/control-planes/components/ControlPlaneStatus.vue'
import type { ServiceDefinition } from '@kumahq/container'
import type { Env } from '@/app/application'

type Token = ReturnType<typeof token>

const $ = {
  ControlPlaneStatus: token<typeof ControlPlaneStatus>('control-planes.components.ControlPlaneStatus'),
  ControlPlaneActionGroup: token<typeof ControlPlaneActionGroup>('control-planes.components.ControlPlaneActionGroup'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('control-planes.sources'), {
      service: (fetch: typeof globalThis.fetch, env: Env) => sources({
        fetch,
        baseUrl: env('KUMA_API_URL'),
        versionUrl: env('KUMA_VERSION_URL'),
        version: env('KUMA_VERSION'),
      }),
      arguments: [
        app.fetch,
        app.env,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('control-planes.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
    [$.ControlPlaneStatus, {
      service: () => {
        return ControlPlaneStatus
      },
    }],
    [$.ControlPlaneActionGroup, {
      service: () => {
        return undefined
      },
    }],
    [token('control-planes.routes'), {
      service: routes,
      labels: [
        app.routes,
      ],
    }],
    [token('control-planes.features'), {
      service: features,
      arguments: [
        app.env,
      ],
      labels: [
        app.features,
      ],
    }],
  ]
}

export const TOKENS = $
export const [
  useControlPlaneStatus,
  useControlPlaneActionGroup,
] = createInjections(
  $.ControlPlaneStatus,
  $.ControlPlaneActionGroup,
)
