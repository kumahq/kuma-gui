import { token, createInjections } from '@kumahq/container'

import PolicyActionGroup from './components/PolicyActionGroup.vue'
import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import { sources } from './sources'
import type { ServiceDefinition } from '@kumahq/container'

type Token = ReturnType<typeof token>

const $ = {
  PolicyActionGroup: token<typeof PolicyActionGroup>('policies.components.PolicyActionGroup'),
}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [$.PolicyActionGroup, {
      service: () => PolicyActionGroup,
    }],
    [token('policies.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('policies.routes'), {
      service: () => {
        return [routes()]
      },
      labels: [
        app.routes,
      ],
    }],
    [token('policies.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
  ]
}
export const TOKENS = $
export const [
  usePolicyActionGroup,
] = createInjections(
  $.PolicyActionGroup,
)
