import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { components } from '@/types/auto-generated.d'
type Entity = components['schemas']['MeshMultiZoneServiceItem']

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
        const name = `${fake.hacker.noun()}`
        const displayName = `${_name || name}-${id}`
        const nspace = fake.k8s.namespace()

        return {
          type: 'MeshMultiZoneService',
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
                'kuma.io/zone': fake.hacker.noun(),
              },
            }
            : {}),
          spec: {
            selector: {
              meshService: {
                matchLabels: fake.kuma.tags({}),
              },
            },
          },
          status: {
            ports: Array.from({ length: 5 }).map(_ => (
              {
                port: fake.internet.port(),
                targetPort: fake.internet.port(),
                appProtocol: fake.kuma.protocol(),
              }
            )),
            meshServices: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map(_ => ({
              name: `${fake.hacker.noun()}-${i}${k8s ? `.${fake.k8s.namespace()}` : ''}`,
            })),
            addresses: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map(_ => ({
              hostname: fake.internet.domainName(),
            })),
            vips: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map(_ => ({
              ip: fake.internet.ip(),
            })),
          },
        } satisfies Entity & {
          creationTime: string
          modificationTime: string
        }
      }),
    },
  }
}
