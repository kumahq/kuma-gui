import Kongponents from '@kong/kongponents'
import { token } from '@kumahq/container'

import { services as controlPlanes } from '@/app/control-planes'
import { services as hostnameGenerators } from '@/app/hostname-generators'
import { services as me } from '@/app/me'
import { services as meshes } from '@/app/meshes'
import X from '@/app/x'
import { services as zones } from '@/app/zones'
import type { ServiceDefinition, Token } from '@kumahq/container'

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    ...me(app),
    [token('service-mesh.plugins'), {
      service: (i18n) => {
        return [
          [Kongponents],
          [X, { i18n }],
        ]
      },
      arguments:[
        app.i18n,
      ],
      labels: [
        app.plugins,
      ],
    }],
    //
    ...controlPlanes(app),
    ...zones(app),
    ...meshes(app),
    ...hostnameGenerators(app),
  ]
}
