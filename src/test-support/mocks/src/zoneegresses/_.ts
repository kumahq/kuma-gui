import type { EndpointDependencies, MockResponder } from '@/test-support'

export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const { name } = req.params
  const zoneName = fake.hacker.noun()

  return {
    headers: {},
    body: {
      type: 'ZoneEgress',
      name,
      creationTime: '2021-07-13T08:40:59Z',
      modificationTime: '2021-07-13T08:40:59Z',
      zone: zoneName,
      networking: {
        address: fake.internet.ip(),
        port: fake.internet.port(),
        admin: {
          port: fake.internet.port(),
        },
      },
    },
  }
}
