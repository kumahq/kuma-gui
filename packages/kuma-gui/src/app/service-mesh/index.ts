import Kongponents from '@kong/kongponents'
import { token } from '@kumahq/container'
import X from '@kumahq/x'
import { useLink } from 'vue-router'

import type { Can } from '@/app/application'
import { services as controlPlanes } from '@/app/control-planes'
import { services as hostnameGenerators } from '@/app/hostname-generators'
import { Kri } from '@/app/kuma'
import { services as me } from '@/app/me'
import { services as meshes } from '@/app/meshes'
import { useRouter } from '@/app/vue'
import { services as zones } from '@/app/zones'
import type { ServiceDefinition, Token } from '@kumahq/container'

const protocolHandler = (can: Can) => {
  const router = useRouter()
  return (href: string) => {
    const kriProto = 'kri://'
    switch (true) {
      case href.startsWith(kriProto): {
        const params = router.currentRoute.value.params
        const { mesh, name, zone, namespace, shortName } = Kri.fromString(href.substring(kriProto.length))
        const id = `${name}${namespace !== '' ? `.${namespace}`: '' }`

        const to = (() => {
          switch (true) {
            case shortName === 'm':
              return {
                name: 'mesh-detail-view',
                params: {
                  mesh,
                },
              }
            case shortName === 'z':
              if(can('use zones')) {
                return {
                  name: 'zone-cp-detail-view',
                  params: {
                    zone,
                  },
                }
              }
              break
            case shortName === 'wl':
              return {
                name: 'workload-detail-view',
                params: {
                  wl: Kri.toString({ mesh: mesh || String(params.mesh), zone: zone || 'default', namespace, shortName, name }),
                },
              }
            case shortName === 'msvc':
              return {
                name: 'mesh-service-detail-view',
                params: {
                  mesh,
                  service: id,
                },
              }
            case shortName === 'mzsvc':
              return {
                name: 'mesh-multi-zone-service-detail-view',
                params: {
                  mesh: mesh,
                  service: id,
                },
              }
            case shortName === 'extsvc':
              return {
                name: 'mesh-external-service-detail-view',
                params: {
                  mesh: mesh,
                  service: id,
                },
              }
            default:
              return
          }
        })()
        if (to) {
          const link = useLink({ to })
          return link.href.value
        }
        return ''
      }
    }
    return href
  }

}
export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    ...me(app),
    [token('service-mesh.plugins'), {
      service: (i18n, can) => {
        return [
          [Kongponents],
          [X, {
            i18n,
            protocolHandler: protocolHandler(can),
          }],
        ]
      },
      arguments: [
        app.i18n,
        app.can,
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
