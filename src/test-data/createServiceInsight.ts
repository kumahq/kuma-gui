import { ServiceInsight } from '@/types'

export function createServiceInsight(): ServiceInsight {
  return {
    type: 'ServiceInsight',
    serviceType: 'internal',
    mesh: 'test-mesh',
    name: 'backend',
    creationTime: '2021-02-19T08:06:15.14624+01:00',
    modificationTime: '2021-02-19T08:07:37.539229+01:00',
    addressPort: 'backend.mesh',
    status: 'partially_degraded',
    dataplanes: {
      total: 2,
      online: 1,
      offline: 1,
    },
  }
}
