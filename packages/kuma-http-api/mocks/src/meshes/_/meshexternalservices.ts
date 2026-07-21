import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'
type Entity = components['schemas']['MeshExternalServiceItem']

export default ({ fake, pager, env }: Dependencies): ResponseHandler => (req) => {
  const query = req.url.searchParams

  const nameQuery = query.get('name') ?? ''
  const namespaceQuery = query.get('filter[labels.k8s.kuma.io/namespace]')
  const zoneQuery = query.get('filter[labels.kuma.io/zone]')

  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_SERVICE_COUNT', `${fake.number.int({ min: 1, max: 120 })}`),
    req,
    `/meshes/${req.params.mesh}/meshservices`,
  )

  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const [
          _prefix,
          shortName,
          mesh,
          zone,
          nspace,
          displayName,
        ] = [
          'kri', // prefix
          'extsvc', // shortName
          String(req.params.mesh), // mesh
          zoneQuery ?? fake.helpers.arrayElement(['', fake.word.noun()]), // zone
          ...([k8s ? namespaceQuery ?? fake.word.noun() : '', `${nameQuery || fake.word.noun()}-${id}`]), // nspace, displayName
        ]

        return {
          type: 'MeshExternalService',
          mesh,
          name: `${displayName}${k8s ? `.${nspace}` : ''}`,
          ...fake.kuma.timespan(),
          kri: fake.kuma.kri({ shortName, mesh, zone, namespace: nspace, name: displayName, sectionName: '' }),
          labels: {
            ...fake.kuma.labels({
              name: displayName,
              ...(zone ? { zone } : {}),
              ...(k8s ? { namespace: nspace } : {}),
            }),
          },
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
