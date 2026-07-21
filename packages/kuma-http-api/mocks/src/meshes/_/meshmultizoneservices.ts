import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'
type Entity = components['schemas']['MeshMultiZoneServiceItem']

export default ({ fake, pager, env }: Dependencies): ResponseHandler => (req) => {
  const query = req.url.searchParams

  const nameQuery = query.get('name') ?? ''
  const namespaceQuery = query.get('filter[labels.k8s.kuma.io/namespace]')

  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_MULTIZONESERVICE_COUNT', `${fake.number.int({ min: 1, max: 120 })}`),
    req,
    `/meshes/${req.params.mesh}/meshservices`,
  )
  const serviceCount = parseInt(env('KUMA_SERVICE_COUNT', `${fake.number.int({ min: 1, max: 120 })}`))

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
          _zone,
          nspace,
          displayName,
        ] = [
          'kri', // prefix
          'mzsvc', // shortName
          String(req.params.mesh), // mesh
          '', // zone
          ...([k8s ? namespaceQuery ?? fake.word.noun() : '', `${nameQuery || fake.word.noun()}-${id}`]), // nspace, displayName
        ]

        return {
          type: 'MeshMultiZoneService',
          mesh,
          name: `${displayName}${k8s ? `.${nspace}` : ''}`,
          ...fake.kuma.timespan(),
          kri: fake.kuma.kri({ shortName, mesh, zone: '', namespace: nspace, name: displayName, sectionName: '' }),
          labels: {
            ...fake.kuma.labels({
              name: displayName,
              ...(k8s ? { namespace: nspace } : {}),
            }),
          },
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
              meshService: {
                matchLabels: fake.kuma.tags({}),
              },
            },
          },
          status: {
            meshServices: Array.from({ length: serviceCount }).map(_ => ({
              name: `${fake.word.noun()}-${i}`,
              mesh: fake.word.noun(),
              namespace: `${k8s ? `.${fake.k8s.namespace()}` : ''}`,
              zone: fake.word.noun(),
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
