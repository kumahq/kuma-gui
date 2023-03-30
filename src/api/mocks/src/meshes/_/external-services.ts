import type { EndpointDependencies, MockResponder } from '@/api/mocks/index'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const total = fake.datatype.number(200)
  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: total }).map((_, i) => {
        const name = `${fake.hacker.noun()}-${i}`
        return {
          type: 'ExternalService',
          mesh: params.mesh,
          name,
          creationTime: '2021-02-02T10:59:26.640498+01:00',
          modificationTime: '2021-02-02T10:59:26.640498+01:00',
          networking: {
            address: `${name}.mesh:${fake.internet.port()}`,
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
            'kuma.io/service': name,
          },
        }
      }),
      next: null,
    },
  }
}
