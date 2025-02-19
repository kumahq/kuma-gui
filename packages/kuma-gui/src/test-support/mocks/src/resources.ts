import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (_req) => {
  const policies = Array.from(fake.kuma.policyNames({ includeAll: true }))
  
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
          ...(policies.find((policy) => policy.includes(name) /* includes legacy policies */) && { policy: {
            isTargetRef: fake.datatype.boolean(),
            hasToTargetRef: fake.datatype.boolean(),
            hasFromTargetRef: fake.datatype.boolean(),
          }}),
        }
      }),
    },
  }
}
