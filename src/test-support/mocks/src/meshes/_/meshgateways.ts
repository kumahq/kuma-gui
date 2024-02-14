import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { MeshGateway } from '@/types/index.d'

export default ({ env, fake, pager }: EndpointDependencies): MockResponder => (req) => {
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_MESHGATEWAY_COUNT', `${fake.number.int({ min: 1, max: 120 })}`),
    req,
    `/meshes/${req.params.mesh}/meshgateways`,
  )
  const mesh = req.params.mesh as string

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
            listeners: [
              {
                hostname: 'foo.example.com',
                port: 8080,
                protocol: 'HTTP',
                tags: fake.kuma.tags({}),
              },
            ],
          },
        } satisfies MeshGateway
      }),
    },
  }
}
