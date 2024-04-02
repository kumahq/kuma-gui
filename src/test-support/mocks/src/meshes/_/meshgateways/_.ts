import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { MeshGateway } from '@/types/index.d'

export default ({ env, fake }: EndpointDependencies): MockResponder => (req) => {
  const mesh = req.params.mesh as string
  const name = req.params.name as string

  const listenerCount = parseInt(env('KUMA_LISTENER_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))

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
      selectors: [{ match: fake.kuma.tags({ service: name }) }],
      conf: {
        listeners: Array.from({ length: listenerCount }).map(() => {
          return {
            hostname: `${fake.internet.domainWord()}.${fake.internet.domainName()}`,
            port: fake.internet.port(),
            protocol: fake.helpers.weightedArrayElement<'HTTP' | 'HTTPS' | 'TCP' | 'TLS'>([
              { value: 'HTTP', weight: 3 },
              { value: 'HTTPS', weight: 3 },
              { value: 'TCP', weight: 1 },
              { value: 'TLS', weight: 1 },
            ]),
            ...(fake.datatype.boolean({ probability: 0.2 }) && {
              tags: fake.kuma.tags({}),
            }),
            ...(fake.datatype.boolean() && {
              crossMesh: true,
            }),
            ...(fake.datatype.boolean() && {
              tls: {
                mode: fake.helpers.arrayElement<'TERMINATE' | 'PASSTHROUGH'>(['TERMINATE', 'PASSTHROUGH']),
              },
            }),
          }
        }),
      },
    } satisfies MeshGateway,
  }
}
