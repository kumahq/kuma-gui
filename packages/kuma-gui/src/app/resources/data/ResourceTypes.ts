import type { paths } from '@kumahq/kuma-http-api'

type KumaResourceTypesCollection = paths['/_resources']['get']['responses']['200']['content']['application/json']

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

export const ResourcesTypes = {
  fromObject(partialResource: KumaResourceTypesCollection['resources'][number]) {
    return {
      ...partialResource,
      categories: (() => {
        const name = partialResource.name.toLowerCase()
        return resourceCategories.get(name) ?? []
      })(),
      deprecated: partialResource.policy?.isTargetRef === false,
      scope: ('policy' in partialResource ? 'policies' : (partialResource.scope ?? 'others')).toLowerCase(),
    }
  },

  fromCollection(partialResources: KumaResourceTypesCollection) {
    return {
      ...partialResources,
      resources: partialResources.resources.map(this.fromObject),
    }
  },
}

export type ResourceType = ReturnType<typeof ResourcesTypes.fromObject>
export type ResourceTypeCollection = ReturnType<typeof ResourcesTypes.fromCollection>
