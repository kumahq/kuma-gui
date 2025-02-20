import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (_req) => {
  const policies = Array.from(fake.kuma.policyNames({ min: Number.MAX_VALUE }, { includeLegacy: true }))
  const legacyPolicies = fake.kuma.policyNamesLegacy({ min: Number.MAX_VALUE })
  
  return {
    headers: {},
    body: {
      resources: fake.kuma.resourceNames({ min: Number.MAX_VALUE }).map((name) => {
        const scope = fake.helpers.arrayElement(['Mesh', 'Global'])

        return {
          name,
          scope,
          readOnly: fake.datatype.boolean(),
          path: `${(name.includes('Mesh') ? name : name.replace(/([a-z0-9])([A-Z])/g, '$1-$2')).toLowerCase()}s`,
          singularDisplayName: name,
          pluralDisplayName: `${name}s`,
          includeInFederation: fake.datatype.boolean(),
          // only for resources that are policy type ones, including legacy policy types
          ...(policies.find((policy) => policy.includes(name)) && { policy: {
            // legacy policies don't have targetRef
            isTargetRef: !legacyPolicies.find((policy) => policy === name),
            hasToTargetRef: fake.datatype.boolean(),
            hasFromTargetRef: fake.datatype.boolean(),
          }}),
        }
      }).sort((a, b) => new Intl.Collator('en').compare(a.name, b.name)), /* We have to sort to always return in the same order */
    },
  }
}
