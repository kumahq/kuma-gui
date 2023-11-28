import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const { mesh } = req.params
  const name = req.params.name as string

  const serviceType = ['internal', 'gateway_builtin', 'gateway_delegated', 'external'].find((type) => name.endsWith(`-${type}`)) ?? fake.kuma.serviceType()
  const addressPort = serviceType === 'internal' ? `${name}.mesh:${fake.internet.port()}` : undefined
  const status = serviceType === 'internal' ? fake.kuma.status() : undefined
  const dataplanes = serviceType === 'internal' ? fake.kuma.healthStatus() : undefined

  return {
    headers: {},
    body: {
      type: 'ServiceInsight',
      serviceType,
      mesh,
      name,
      creationTime: '2021-02-19T08:06:15.14624+01:00',
      modificationTime: '2021-02-19T08:07:37.539229+01:00',
      ...(addressPort && { addressPort }),
      ...(status && { status }),
      ...(dataplanes && { dataplanes }),
    },
  }
}
