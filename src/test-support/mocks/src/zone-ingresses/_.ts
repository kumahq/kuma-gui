import type { EndpointDependencies, MockResponder } from '@/test-support'

export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const { name } = req.params
  const zoneName = fake.hacker.noun()

  return {
    headers: {},
    body: {
      type: 'ZoneIngress',
      name,
      creationTime: '2021-07-13T08:40:59Z',
      modificationTime: '2021-07-13T08:40:59Z',
      zone: zoneName,
      networking: {
        address: fake.internet.ip(),
        advertisedAddress: fake.internet.ip(),
        port: fake.internet.port(),
        advertisedPort: fake.internet.port(),
      },
      availableServices: [
        {
          tags: {
            app: 'demo-app',
            'kuma.io/protocol': fake.kuma.protocol(),
            'kuma.io/service': 'demo-app_kuma-demo_svc_5000',
            'kuma.io/zone': zoneName,
            'pod-template-hash': '5845d6447b',
          },
          instances: 1,
          mesh: 'default',
        },
        {
          tags: {
            app: 'redis',
            'kuma.io/protocol': fake.kuma.protocol(),
            'kuma.io/service': 'redis_kuma-demo_svc_6379',
            'kuma.io/zone': zoneName,
            'pod-template-hash': '59c9d56fc',
          },
          instances: 1,
          mesh: 'default',
        },
      ],
    },
  }
}
