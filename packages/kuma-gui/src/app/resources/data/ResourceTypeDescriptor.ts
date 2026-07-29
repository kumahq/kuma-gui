import type { paths } from '@kumahq/kuma-http-api'

type KumaResourceTypeDescriptorCollection = paths['/_resources']['get']['responses']['200']['content']['application/json']
type KumaResourceTypeDescriptor = KumaResourceTypeDescriptorCollection['resources'][number]

const resourceCategories = new Map<string, string[]>([
  // resilience
  ['circuitbreaker', ['resilience']],
  ['meshcircuitbreaker', ['resilience']],
  ['ratelimit', ['resilience']],
  ['meshratelimit', ['resilience']],
  ['retry', ['resilience']],
  ['meshretry', ['resilience']],
  ['healthcheck', ['resilience']],
  ['meshhealthcheck', ['resilience']],
  ['timeout', ['resilience']],
  ['meshtimeout', ['resilience']],

  // traffic
  ['trafficroute', ['traffic']],
  ['meshhttproute', ['traffic']],
  ['meshtcproute', ['traffic']],
  ['meshloadbalancingstrategy', ['traffic']],
  ['meshpassthrough', ['traffic']],
  ['meshgatewayroute', ['traffic']],

  // security
  ['trafficpermission', ['security']],
  ['meshtrafficpermission', ['security']],
  ['meshtls', ['security']],

  // o11y
  ['meshaccesslog', ['observability']],
  ['meshmetric', ['observability']],
  ['meshtrace', ['observability']],
  ['traffictrace', ['observability']],
  ['trafficlog', ['observability']],

  // testing
  ['faultinjection', ['testing']],
  ['meshfaultinjection', ['testing']],

  // advanced
  ['meshproxypatch', ['advanced']],
  ['proxytemplate', ['advanced']],
])

export const ResourceTypeDescriptor = {
  fromObject(item: KumaResourceTypeDescriptor) {
    const group = ('policy' in item ? 'policy' : (item.scope ?? 'others')).toLowerCase()
    return {
      ...item,
      group,
      categories: resourceCategories.get(item.name.toLowerCase()) ?? [],
      insightPath: ((shortName) => {
        switch (shortName) {
          case 'z':
            return 'zones.controlPlanes'
          case 'zi':
            return 'zones.zoneIngresses'
          case 'ze':
            return 'zones.zoneEgresses'
          case 'm':
            return 'meshes'
          default:
            return `resources.${item.name}`
        }
      })(item.shortName),
    }
  },

  fromCollection(partialResources: KumaResourceTypeDescriptorCollection) {
    return {
      ...partialResources,
      resources: partialResources.resources.map(this.fromObject),
    }
  },
}

export type ResourceTypeDescriptor = ReturnType<typeof ResourceTypeDescriptor.fromObject>
export type ResourceTypeDescriptorCollection = ReturnType<typeof ResourceTypeDescriptor.fromCollection>
