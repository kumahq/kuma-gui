import type { EndpointDependencies, MockResponder } from '@/test-support/fake'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const isGateway = params.name.includes('gateway')
  const name = `${fake.hacker.noun()}`
  const zone = `${fake.hacker.noun()}`
  const isMultizone = true && fake.datatype.boolean()
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
              'kuma.io/service': name,
              ...(isMultizone && {
                'kuma.io/zone': zone,
              }),
            },
            type: 'BUILTIN',
          },
        }),
        inbound: [
          {
            port: fake.internet.port(),
            servicePort: fake.internet.port(),
            serviceAddress: fake.internet.ip(),
            tags: {
              'kuma.io/protocol': fake.kuma.protocol(),
              'kuma.io/service': name,
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
