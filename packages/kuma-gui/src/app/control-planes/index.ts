import { token, createInjections } from '@kumahq/kontainer'

import { features } from './features'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import ControlPlaneActionGroup from '@/app/control-planes/components/ControlPlaneActionGroup.vue'
import ControlPlaneStatus from '@/app/control-planes/components/ControlPlaneStatus.vue'
import type { ServiceDefinition } from '@kumahq/kontainer'

type Token = ReturnType<typeof token>

const $ = {
  sources: token<ReturnType<typeof sources>>('control-planes.sources'),
  ControlPlaneStatus: token<typeof ControlPlaneStatus>('control-planes.components.ControlPlaneStatus'),
  ControlPlaneActionGroup: token<typeof ControlPlaneActionGroup>('control-planes.components.ControlPlaneActionGroup'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [$.sources, {
      service: sources,
      arguments: [
        app.env,
        app.api,
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
        return ControlPlaneActionGroup
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
