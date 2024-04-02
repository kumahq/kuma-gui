import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { MeshGateway } from '@/types/index.d'

export default ({ env, fake, pager }: EndpointDependencies): MockResponder => (req) => {
  const mesh = req.params.mesh as string

  const { offset, total, next, pageTotal } = pager(
    env('KUMA_MESHGATEWAY_COUNT', `${fake.number.int({ min: 1, max: 120 })}`),
    req,
    `/meshes/${req.params.mesh}/meshgateways`,
  )
  const listenerCount = parseInt(env('KUMA_LISTENER_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))

  return {
    headers: {},
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const name = `${fake.hacker.noun()}-${id}`

        return {
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
