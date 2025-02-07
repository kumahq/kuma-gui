import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { components } from '@kumahq/kuma-http-api'
type Entity = components['schemas']['MeshServiceItem']

export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const query = req.url.searchParams

  const mesh = req.params.mesh as string
  const _name = query.get('name') ?? ''

  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_SERVICE_COUNT', `${fake.number.int({ min: 1, max: 120 })}`),
    req,
    `/meshes/${req.params.mesh}/meshservices`,
  )

  return {
    headers: {},
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const name = `${fake.word.noun()}`
        const displayName = `${_name || name}-${id}`
        const nspace = fake.k8s.namespace()

        const proxies = fake.number.int({ min: 1, max: 120 })

        return {
          type: 'MeshService',
          mesh,
          name: `${displayName}${k8s ? `.${nspace}` : ''}`,
          creationTime: '2021-02-19T08:06:15.14624+01:00',
          modificationTime: '2021-02-19T08:07:37.539229+01:00',
          ...(k8s
            ? {
              labels: {
                'kuma.io/display-name': displayName,
                'k8s.kuma.io/namespace': nspace,
                'kuma.io/origin': 'zone',
                'kuma.io/zone': fake.word.noun(),
              },
            }
            : {}),
          spec: {
            ports: Array.from({ length: 5 }).map(_ => (
              {
                name: fake.helpers.arrayElement([fake.word.noun(), String(fake.internet.port())]),
                port: fake.internet.port(),
                targetPort: fake.internet.port(),
                appProtocol: fake.kuma.protocol(),
              }
            )),
            selector: {
              dataplaneTags: fake.kuma.tags({}),
            },
            state: fake.helpers.arrayElement(['Available', 'Unavailable']),
          },
          status: {
            addresses: Array.from({ length: fake.number.int({ min: 0, max: 5 }) }).map(_ => ({
              hostname: fake.internet.domainName(),
            })),
            vips: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map(_ => ({
              ip: fake.internet.ip(),
            })),
            tls: {
              status: fake.helpers.arrayElement([undefined, 'Ready', 'NotReady']),
            },
            dataplaneProxies: {
              connected: fake.number.int({ min: 1, max: proxies }),
              healthy: fake.number.int({ min: 1, max: proxies }),
              total: proxies,
            },
          },
        } satisfies Entity & {
          creationTime: string
          modificationTime: string
        }
      }),
    },
  }
}
