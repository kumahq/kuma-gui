import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  return {
    headers: {},
    body: {
      type: 'ExternalService',
      mesh: params.mesh,
      name: params.name,
      creationTime: '2021-02-02T10:59:26.640498+01:00',
      modificationTime: '2021-02-02T10:59:26.640498+01:00',
      networking: {
        address: `${fake.internet.url()}:${fake.internet.port()}`,
        tls: {
          enabled: true,
          allowRenegotiation: false,
          clientCert: {
            secret: 'clientCert',
          },
          clientKey: {
            secret: 'clientKey',
          },
        },
      },
      tags: {
        'kuma.io/protocol': fake.kuma.protocol(),
        'kuma.io/service': params.name,
      },
    },
  }
}
