import type { Dependencies, ResponseHandler } from '#mocks'
import type { MeshGateway } from '@/types/index.d'

export default ({ env, fake, pager }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  const { offset, total, next, pageTotal } = pager(
    env('KUMA_MESHGATEWAY_COUNT', `${fake.number.int({ min: 1, max: 120 })}`),
    req,
    `/meshes/${req.params.mesh}/meshgateways`,
  )
  const listenerCount = parseInt(env('KUMA_LISTENER_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))

  const nameQuery = req.url.searchParams.get('name')
  const namespaceQuery = req.url.searchParams.get('filter[labels.k8s.kuma.io/namespace]')
  const zoneQuery = req.url.searchParams.get('filter[labels.kuma.io/zone]')

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
          'mgw', // shortName
          String(req.params.mesh), // mesh
          zoneQuery ?? fake.helpers.arrayElement(['', fake.word.noun()]), // zone
          ...([k8s ? namespaceQuery ?? fake.word.noun() : '', `${nameQuery || fake.word.noun()}-${id}`]), // nspace, displayName
        ]
        const name = `${displayName}${k8s ? `.${nspace}` : ''}`

        return {
          type: 'MeshGateway',
          mesh,
          name,
          ...fake.kuma.timespan(),
          kri: fake.kuma.kri({ shortName, mesh, zone, namespace: k8s ? nspace : '', displayName, sectionName: '' }),
          labels: {
            ...fake.kuma.labels({
              name: displayName,
              ...(zone && { zone }),
              ...(k8s && { namespace: nspace }),
            }),
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
