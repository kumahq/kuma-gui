import Kongponents from '@kong/kongponents'
import { token } from '@kumahq/container'
import X from '@kumahq/x'

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
  return (href: string) => {
    const kriProto = 'kri://'
    switch (true) {
      case href.startsWith(kriProto): {
        const { mesh, name: encodedName, zone, namespace, shortName } = Kri.fromString(href.substring(kriProto.length))
        // old style names can have _ in them that are replaced with `~`
        const name = encodedName.replaceAll('~', '_')
        const id = `${name}${namespace !== '' ? `.${namespace}`: '' }`
        const to = (() => {
          switch (true) {
            case shortName === 'm':
              return {
                name: 'mesh-detail-view',
                params: {
                  mesh: name,
                },
              }
            case shortName === 'z':
              if(can('use zones')) {
                return {
                  name: 'zone-cp-detail-view',
                  params: {
                    zone: name,
                  },
                }
              }
              break
            case shortName === 'wl':
              return {
                name: 'workload-detail-view',
                params: {
                  wl: Kri.toString({ shortName, mesh, zone, namespace, name }),
                },
              }
            case shortName === '~hostport':
              return {
                name: 'data-plane-list-view',
                query: {
                  s: `tag:service:${name}`,
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
          const router = useRouter()
          try {
            return router.resolve(to).href
          } catch(e) {
            // log the error, don't throw it
            // anything errors we just don't show the link
            console.error(e)
            return ''
          }
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
