import type { Dependencies, ResponseHandler } from '#mocks'
import type { paths } from '@kumahq/kuma-http-api'

type ResourcesApi = paths['/_resources']['get']['responses']['200']['content']['application/json']

export default ({ fake, env }: Dependencies): ResponseHandler => (_req) => {
  const policies = Array.from(fake.kuma.policyNames({ min: Number.MAX_SAFE_INTEGER }))
  const legacyPolicies = fake.kuma.policyNamesLegacy({ min: Number.MAX_SAFE_INTEGER })
  const resourceCount = parseInt(env('KUMA_RESOURCE_COUNT', `${Number.MAX_SAFE_INTEGER}`))

  return {
    headers: {},
    body: {
      resources: fake.kuma.resourceNames(resourceCount).map((name) => {
        const scope = fake.helpers.arrayElement(['Mesh', 'Global'])

        return {
          name,
          scope,
          readOnly: fake.datatype.boolean(),
          path: `${(name.includes('Mesh') ? name : name.replace(/([a-z0-9])([A-Z])/g, '$1-$2')).toLowerCase()}s`,
          singularDisplayName: name,
          shortName: new Map([
            ['Dataplane', 'dp'],
            ['HostnameGenerator', 'hg'],
            ['Mesh', 'm'],
            ['MeshAccessLog', 'mal'],
            ['MeshCircuitBreaker', 'mcb'],
            ['MeshExternalService', 'extsvc'],
            ['MeshFaultInjection', 'mfi'],
            ['MeshGateway', 'mgw'],
            ['MeshHTTPRoute', 'mhttpr'],
            ['MeshHealthCheck', 'mhc'],
            ['MeshIdentity', 'mid'],
            ['MeshLoadBalancingStrategy', 'mlbs'],
            ['MeshMetric', 'mm'],
            ['MeshMultiZoneService', 'mzsvc'],
            ['MeshPassthrough', 'mp'],
            ['MeshProxyPath', 'mpp'],
            ['MeshRateLimit', 'mrl'],
            ['MeshRetry', 'mr'],
            ['MeshService', 'msvc'],
            ['MeshTCPRoute', 'mtcpr'],
            ['MeshTLS', 'mtls'],
            ['MeshTimeout', 'mt'],
            ['MeshTrace', 'mtr'],
            ['MeshTrafficPermission', 'mtp'],
            ['MeshTrust', 'mtrust'],
            ['ZoneEgress', 'ze'],
            ['ZoneIngress', 'zi'],
          ]).get(name) ?? '',
          pluralDisplayName: `${name}s`,
          includeInFederation: fake.datatype.boolean(),
          // only for resources that are policy type ones, including legacy policy types
          ...(policies.find((policy) => policy.includes(name)) && { policy: {
            // legacy policies don't have targetRef
            isTargetRef: !legacyPolicies.find((policy) => policy === name),
            hasToTargetRef: fake.datatype.boolean(),
            hasFromTargetRef: fake.datatype.boolean(),
            isFromAsRules: fake.datatype.boolean(),
          }}),
        }
      }).sort((a, b) => new Intl.Collator('en').compare(a.name, b.name)), /* We have to sort to always return in the same order */
    } satisfies ResourcesApi,
  }
}
