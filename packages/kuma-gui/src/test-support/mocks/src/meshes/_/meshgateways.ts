import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { MeshGateway } from '@/types/index.d'

export default ({ env, fake, pager }: EndpointDependencies): MockResponder => (req) => {
  const mesh = req.params.mesh as string
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  const { offset, total, next, pageTotal } = pager(
    env('KUMA_MESHGATEWAY_COUNT', `${fake.number.int({ min: 1, max: 120 })}`),
    req,
    `/meshes/${req.params.mesh}/meshgateways`,
  )
  const listenerCount = parseInt(env('KUMA_LISTENER_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))

  const queryName = req.url.searchParams.get('name')
  const queryNamespace = req.url.searchParams.get('filter[labels.k8s.kuma.io/namespace]')
  const queryZone = req.url.searchParams.get('filter[labels.kuma.io/zone]')

  return {
    headers: {},
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const name = `${fake.word.noun()}-${id}`

        const displayName = `${queryName?.padEnd(queryName.length + 1, '-') ?? ''}${name}${fake.kuma.dataplaneSuffix(k8s)}`
        const nspace = queryNamespace ?? fake.k8s.namespace()
        const zone = queryZone ?? fake.word.noun()

        return {
          type: 'MeshGateway',
          mesh,
          name: `${displayName}${k8s ? `.${nspace}` : ''}`,
          creationTime: '2022-01-25T13:55:51.798701+01:00',
          modificationTime: '2022-01-25T13:55:51.798701+01:00',
          labels: {
            'kuma.io/display-name': displayName,
            'kuma.io/origin': fake.kuma.origin(),
            'kuma.io/zone': zone,
            ...(k8s
              ? {
                'k8s.kuma.io/namespace': nspace,
              }
              : {}),
          },
          selectors: [
            {
              match: fake.kuma.tags({ service: name }),
            },
          ],
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
                    certificates: [
                      {
                        secret: 'my-gateway-certificate',
                      },
                    ],
                  },
                }),
              }
            }),
          },
        } satisfies MeshGateway
      }),
    },
  }
}
