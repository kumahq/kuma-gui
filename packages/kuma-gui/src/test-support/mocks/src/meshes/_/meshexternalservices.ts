import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { components } from '@kumahq/kuma-http-api'
type Entity = components['schemas']['MeshExternalServiceItem']

export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const query = req.url.searchParams

  const mesh = req.params.mesh as string
  const _name = query.get('name') ?? ''
  const namespaceQuery = query.get('filter[labels.k8s.kuma.io/namespace]')
  const zoneQuery = query.get('filter[labels.kuma.io/zone]')

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
        const nspace = namespaceQuery ?? fake.k8s.namespace()
        const zone = zoneQuery ?? fake.word.noun()

        return {
          type: 'MeshExternalService',
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
                'kuma.io/zone': zone,
              },
            }
            : {}),
          spec: {
            match: {
              type: 'HostnameGenerator',
              port: fake.internet.port(),
              protocol: fake.kuma.protocol(),
            },
            endpoints: [
              {
                address: fake.internet.domainName(),
                port: fake.internet.port(),
              },
            ],
            tls: {
              allowRenegotiation: fake.datatype.boolean(),
              enabled: fake.datatype.boolean(),
            },
          },
          status: {
            addresses: Array.from({ length: fake.number.int({ min: 0, max: 5 }) }).map(_ => ({
              hostname: fake.internet.domainName(),
            })),
            vip: {
              ip: fake.internet.ip(),
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
