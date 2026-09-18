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
      ...(typeof item.policy !== 'undefined' && {
        policy: {
          ...item.policy,
          // Backfills some legacy flags that are gone from OAS, but we keep reading them in the views.
          isTargetRef: 'isTargetRef' in item.policy ? item.policy.isTargetRef as boolean : true,
          hasFromTargetRef: 'hasFromTargetRef' in item.policy ? item.policy.hasFromTargetRef as boolean : true,
          isFromAsRules: 'isFromAsRules' in item.policy ? item.policy.isFromAsRules as boolean : true,
        },
      }),
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
