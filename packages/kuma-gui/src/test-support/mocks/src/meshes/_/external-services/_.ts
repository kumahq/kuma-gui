import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { ExternalService } from '@/types/index.d'

export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const mesh = req.params.mesh as string
  const name = req.params.name as string

  return {
    headers: {},
    body: {
      ...(req.url.searchParams.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'ExternalService',
      mesh,
      name,
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
        'kuma.io/service': name,
      },
    } satisfies ExternalService,
  }
}
