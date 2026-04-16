import type { paths } from '@kumahq/kuma-http-api'

type KumaResourceTypeDescriptorCollection = paths['/_resources']['get']['responses']['200']['content']['application/json']
type KumaResourceTypeDescriptor = KumaResourceTypeDescriptorCollection['resources'][number]

const resourceCategories = new Map<string, string[]>([
  ['circuitbreaker', ['reliability', 'performance']],
  ['meshcircuitbreaker', ['reliability', 'performance']],
  ['dataplane', ['traffic']],
  ['externalservice', ['traffic']],
  ['meshexternalservice', ['traffic']],
  ['faultinjection', ['reliability']],
  ['meshfaultinjection', ['reliability']],
  ['globalsecret', ['security']],
  ['healthcheck', ['reliability']],
  ['meshhealthcheck', ['reliability']],
  ['hostnamegenerator', ['traffic']],
  ['mesh', ['traffic']],
  ['meshaccesslog', ['observability']],
  ['trafficlog', ['observability']],
  ['meshgateway', ['traffic']],
  ['meshgatewayroute', ['traffic']],
  ['meshhttproute', ['traffic']],
  ['meshidentity', ['security']],
  ['meshloadbalancingstrategy', ['performance', 'traffic']],
  ['meshmetric', ['observability']],
  ['meshmultizoneservice', ['traffic']],
  ['meshpassthrough', ['traffic', 'performance']],
  ['meshproxypatches', ['traffic', 'performance']],
  ['meshratelimit', ['performance', 'reliability']],
  ['ratelimit', ['performance', 'reliability']],
  ['meshretry', ['reliability']],
  ['retry', ['reliability']],
  ['meshservice', ['traffic']],
  ['meshtcproute', ['traffic']],
  ['meshtls', ['security']],
  ['meshtimeout', ['performance', 'reliability']],
  ['timeout', ['performance', 'reliability']],
  ['meshtrace', ['observability']],
  ['traffictrace', ['observability']],
  ['meshtrafficpermission', ['security']],
  ['trafficpermission', ['security']],
  ['meshtrust', ['security']],
  ['proxytemplate', ['performance', 'traffic']],
  ['secret', ['security']],
  ['trafficroute', ['traffic']],
  ['virtualoutbound', ['traffic']],
  ['workload', ['traffic']],
  ['zone', ['traffic']],
])

export const ResourceTypeDescriptor = {
  fromObject(partialResource: KumaResourceTypeDescriptor) {
    return {
      ...partialResource,
      categories: resourceCategories.get(partialResource.name.toLowerCase()) ?? [],
      scope: ('policy' in partialResource ? 'policies' : (partialResource.scope ?? 'others')).toLowerCase(),
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
