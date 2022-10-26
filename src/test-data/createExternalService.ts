import { ExternalService } from '@/types/index.d'

export function createExternalService(): ExternalService {
  return {
    type: 'ExternalService',
    mesh: 'test-mesh',
    name: 'httpbin',
    creationTime: '2021-02-02T10:59:26.640498+01:00',
    modificationTime: '2021-02-02T10:59:26.640498+01:00',
    networking: {
      address: 'httpbin.org:80',
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
      'kuma.io/protocol': 'http',
      'kuma.io/service': 'httpbin',
    },
  }
}
