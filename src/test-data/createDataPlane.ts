import { DataPlane } from '@/types'

export function createDataPlane(): DataPlane {
  return {
    type: 'Dataplane',
    mesh: 'test-mesh',
    name: 'backend',
    creationTime: '2021-02-17T08:33:36.442044+01:00',
    modificationTime: '2021-02-17T08:33:36.442044+01:00',
    networking: {
      address: '127.0.0.1',
      inbound: [
        {
          port: 7776,
          servicePort: 7777,
          serviceAddress: '127.0.0.1',
          tags: {
            'kuma.io/protocol': 'http',
            'kuma.io/service': 'backend',
          },
        },
      ],
      outbound: [
        {
          port: 10001,
          tags: {
            'kuma.io/service': 'frontend',
          },
        },
      ],
    },
  }
}
