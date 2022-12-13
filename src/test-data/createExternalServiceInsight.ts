import { ServiceInsight } from '@/types/index.d'

export function createExternalServiceInsight(): ServiceInsight {
  return {
    type: 'ServiceInsight',
    serviceType: 'external',
    mesh: 'test-mesh',
    name: 'httpbin',
    creationTime: '2021-02-19T08:06:15.14624+01:00',
    modificationTime: '2021-02-19T08:07:37.539229+01:00',
    addressPort: 'httpbin.org:80',
    status: 'not_available',
    dataplanes: {
      total: 1,
    },
  }
}
