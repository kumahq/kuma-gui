import ZoneControlPlanesListWithCreate from './components/ZoneControlPlanesListWithCreate.vue'
import { features } from './features'
import { routes } from './routes'
import { sources } from './sources'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('zones-crud.routes'), {
      service: routes,
      labels: [
        app.routes,
      ],
    }],
    [token('zones-crud.sources'), {
      service: sources,
      arguments: [
        app.source,
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('zones-crud.features'), {
      service: features,
      arguments: [
        app.env,
      ],
      labels: [
        app.features,
      ],
    }],
    [token('zones-crud.components.ZoneControlPlanesListWithCreate'), {
      service: () => {
        return ZoneControlPlanesListWithCreate
      },
      decorates: app.ZoneControlPlanesList,
    }],
  ]
}
