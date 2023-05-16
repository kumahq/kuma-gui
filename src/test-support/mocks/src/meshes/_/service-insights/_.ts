import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const online = fake.number.int(100)
  const offline = fake.number.int(100)
  return {
    headers: {},
    body: {
      type: 'ServiceInsight',
      serviceType: fake.kuma.serviceType(),
      mesh: params.mesh,
      name: params.name,
      creationTime: '2021-02-19T08:06:15.14624+01:00',
      modificationTime: '2021-02-19T08:07:37.539229+01:00',
      addressPort: `${params.name}.mesh:${fake.internet.port()}`,
      status: fake.kuma.status(),
      dataplanes: {
        total: online + offline,
        online,
        offline,
      },
    },
  }
}
