import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { MeshGateway } from '@/types/index.d'

export default (_deps: EndpointDependencies): MockResponder => (req) => {
  const mesh = req.params.mesh as string
  const name = req.params.name as string

  return {
    headers: {},
    body: {
      type: 'MeshGateway',
      mesh,
      name,
      creationTime: '2024-03-14T09:40:45Z',
      modificationTime: '2024-03-14T09:40:45Z',
      labels: {
        'kuma.io/display-name': 'demo-app',
        'kuma.io/mesh': 'default',
      },
      selectors: [
        {
          match: {
            'kuma.io/service': 'demo-app_gateway',
          },
        },
      ],
      conf: {
        listeners: [
          {
            port: 80,
            protocol: 'HTTP',
            tags: {
              listener: 'listener-0',
            },
          },
          {
            hostname: 'bar.com',
            port: 81,
            protocol: 'HTTP',
            tags: {
              listener: 'listener-1',
            },
            tls: {
              mode: 'PASSTHROUGH',
            },
          },
          {
            port: 82,
            protocol: 'TCP',
          },
        ],
      },
    } satisfies MeshGateway,
  }
}
