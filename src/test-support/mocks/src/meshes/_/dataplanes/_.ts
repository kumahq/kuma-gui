import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params

  const isGateway = params.name.includes('gateway')
  const service = params.name ?? fake.hacker.noun()
  const isMultizone = true && fake.datatype.boolean()
  const zone = fake.hacker.noun()

  return {
    headers: {
    },
    body: {
      type: 'Dataplane',
      mesh: params.mesh,
      name: params.name,
      creationTime: '2021-02-17T08:33:36.442044+01:00',
      modificationTime: '2021-02-17T08:33:36.442044+01:00',
      networking: {
        address: fake.internet.ip(),
        ...(isGateway && {
          gateway: {
            tags: {
              'kuma.io/service': `${service}`,
              ...(isMultizone && {
                'kuma.io/zone': zone,
              }),
            },
            type: 'BUILTIN',
          },
        }),
        inbound: [
          {
            health: {
              ready: fake.datatype.boolean(),
            },
            port: fake.internet.port(),
            servicePort: fake.internet.port(),
            serviceAddress: fake.internet.ip(),
            tags: {
              'kuma.io/protocol': fake.kuma.protocol(),
              'kuma.io/service': `${service}`,
              ...(isMultizone && {
                'kuma.io/zone': zone,
              }),
            },
          },
        ],
        outbound: [
          {
            port: fake.internet.port(),
            tags: {
              'kuma.io/service': fake.hacker.noun(),
            },
          },
        ],
      },
    },
  }
}
