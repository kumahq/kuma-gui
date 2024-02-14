import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { MeshGateway } from '@/types/index.d'

export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const mesh = req.params.mesh as string
  const name = req.params.name as string

  return {
    headers: {},
    body: {
      // Just a quick, obvious way to verify the “Copy as Kubernetes” copy button functionality.
      ...(req.url.searchParams.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'MeshGateway',
      mesh,
      name,
      creationTime: '2022-01-25T13:55:51.798701+01:00',
      modificationTime: '2022-01-25T13:55:51.798701+01:00',
      ...(fake.datatype.boolean() && {
        labels: {
          'kuma.io/origin': 'zone',
          'kuma.io/zone': fake.hacker.noun(),
        },
      }),
      selectors: [
        {
          match: fake.kuma.tags({ service: name }),
        },
      ],
      conf: {
        listeners: [
          {
            hostname: 'foo.example.com',
            port: 8080,
            protocol: 'HTTP',
            tags: fake.kuma.tags({}),
          },
        ],
      },
    } satisfies MeshGateway,
  }
}
