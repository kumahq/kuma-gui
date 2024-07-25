import locales from './locales/en-us/index.yaml'
import { routes } from './routes'
import type { SplitRouteRecordRaw } from './routes'
import { sources } from './sources'
import { services as dataplanes } from '@/app/data-planes'
import { services as externalServicesModule } from '@/app/external-services'
import { services as gatewaysModule } from '@/app/gateways'
import { services as policies } from '@/app/policies'
import { services as rules } from '@/app/rules'
import { services as servicesModule } from '@/app/services'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  const mesh = {
    ...app,
    routes: token<SplitRouteRecordRaw[]>('meshes.routes.children'),
  }
  return [
    [token('meshes.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('meshes.routes'), {
      service: (r) => {
        return routes(r[0], r[1], r[2], r[3])
      },
      arguments: [
        mesh.routes,
      ],
      labels: [
        app.routes,
      ],
    }],
    [token('meshes.locales'), {
      service: () => locales,
      labels: [
        app.enUs,
      ],
    }],
    ...servicesModule(mesh),
    ...externalServicesModule(mesh),
    ...gatewaysModule(mesh),
    ...dataplanes(mesh),
    ...policies(mesh),
    ...rules(mesh),
  ]
}
