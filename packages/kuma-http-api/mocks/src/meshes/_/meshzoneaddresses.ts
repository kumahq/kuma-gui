import type { Dependencies, ResponseHandler } from '#mocks'
import type { paths } from '@kumahq/kuma-http-api'

type MeshZoneAddressesResponse = paths['/meshes/{mesh}/meshzoneaddresses']['get']['responses']['200']['content']['application/json']

export default ({ fake, env, pager }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  const query = req.url.searchParams
  const nameQuery = query.get('name')
  const namespaceQuery = query.get('filter[labels.k8s.kuma.io/namespace]')
  const zoneQuery = query.get('filter[labels.kuma.io/zone]')

  const { offset, total, next, pageTotal } = pager(
    env('KUMA_MESHZONEADDRESS_COUNT', `${fake.number.int({ min: 1, max: 3 })}`),
    req,
    `/meshes/${req.params.mesh}/meshzoneaddresses`,
  )

  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }, (_, i) => {
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
          'mza', // shortName
          String(req.params.mesh), // mesh
          zoneQuery ?? fake.word.noun(), // zone, a MeshZoneAddress is always zone scoped
          ...([k8s ? namespaceQuery ?? fake.word.noun() : '', `${nameQuery ? `${nameQuery}-` : ''}${fake.word.noun()}-${id}`]), // nspace, displayName
        ]
        const name = `${displayName}${nspace ? `.${nspace}` : ''}`

        return {
          ...fake.kuma.timespan(),
          type: 'MeshZoneAddress',
          mesh,
          name,
          kri: fake.kuma.kri({ shortName, mesh, zone, namespace: nspace, displayName }),
          labels: fake.kuma.labels({
            name: displayName,
            mesh,
            env: k8s ? 'kubernetes' : 'universal',
            zone,
            ...(k8s ? { namespace: nspace } : {}),
          }),
          spec: {
            address: fake.internet.ip(),
            port: fake.internet.port(),
          },
        }
      }),
    } satisfies MeshZoneAddressesResponse,
  }
}
