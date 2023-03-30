import type { EndpointDependencies, MockResponder } from '@/api/mocks/index'
export default ({ fake }: EndpointDependencies): MockResponder => (_req) => {
  const total = fake.datatype.number(10)
  const dataplanes = {
    online: fake.datatype.number(10),
    offline: fake.datatype.number(10),
  }

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: total }).map((_, i) => {
        const mesh = `${fake.hacker.noun()}-${i}`
        const name = `${fake.hacker.noun()}-${i}`
        return {
          type: 'ServiceInsight',
          serviceType: `${fake.kuma.serviceType()}`,
          mesh,
          name,
          creationTime: '2021-02-19T08:06:15.14624+01:00',
          modificationTime: '2021-02-19T08:07:37.539229+01:00',
          addressPort: `${name}.mesh:${fake.internet.port()}`,
          status: `${fake.kuma.status()}`,
          dataplanes: {
            total: `${dataplanes.online + dataplanes.offline}`,
            online: `${dataplanes.online}`,
            offline: `${dataplanes.offline}`,
          },
        }
      }),
      next: null,
    },
  }
}
