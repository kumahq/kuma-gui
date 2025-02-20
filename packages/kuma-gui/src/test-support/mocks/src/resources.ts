import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (_req) => {
  const policies = Array.from(fake.kuma.policyNames({ includeAll: true }))
  const legacyPolicies = [
    'CircuitBreaker',
    'FaultInjection',
    'HealthCheck',
    'ProxyTemplate',
    'RateLimit',
    'Retry',
    'Timeout',
    'TrafficLog',
    'TrafficPermission',
    'TrafficRoute',
    'TrafficTrace',
    'VirtualOutbound',
    'MeshGatewayRoute',
  ]
  
  return {
    headers: {},
    body: {
      resources: fake.kuma.resourceNames({ includeAll: true }).map((name) => {
        const scope = fake.helpers.arrayElement(['Mesh', 'Global'])

        return {
          name,
          scope,
          readOnly: fake.datatype.boolean(),
          path: ((_name) => `${_name.includes('Mesh') ? _name.toLocaleLowerCase() : _name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}s`)(name),
          singularDisplayName: name,
          pluralDisplayName: `${name}s`,
          includeInFederation: fake.datatype.boolean(),
          // only for resources that are policy type ones, including legacy policy types
          ...([...legacyPolicies, ...policies].find((policy) => policy.includes(name)) && { policy: {
            // legacy polices don't have targetRef
            isTargetRef: Boolean(policies.find((policy) => policy === name)),
            hasToTargetRef: fake.datatype.boolean(),
            hasFromTargetRef: fake.datatype.boolean(),
          }}),
        }
      }).sort((a, b) => new Intl.Collator('en').compare(a.name, b.name)), /* We have to sort to always return in the same order */
    },
  }
}
