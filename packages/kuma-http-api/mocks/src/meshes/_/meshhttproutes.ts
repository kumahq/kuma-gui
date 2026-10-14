import type { Dependencies, ResponseHandler } from '#mocks'
import type { MeshHTTPRoute } from '@/types/index.d'

export default ({ fake, pager, env }: Dependencies): ResponseHandler => (req) => {
  const mesh = req.params.mesh as string

  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_MESHHTTPROUTES_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    `/meshes/${mesh}/meshhttproutes`,
  )
  const ruleMatchCount = parseInt(env('KUMA_RULE_MATCH_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))

  const nameQuery = req.url.searchParams.get('name')
  const namespaceQuery = req.url.searchParams.get('filter[labels.k8s.kuma.io/namespace]')
  const zoneQuery = req.url.searchParams.get('filter[labels.kuma.io/zone]')

  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      total,
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
          'mhttpr', // shortName
          String(req.params.mesh), // mesh
          zoneQuery ?? fake.helpers.arrayElement(['', fake.word.noun()]), // zone
          ...([k8s ? namespaceQuery ?? fake.helpers.arrayElement(['kuma-system', fake.word.noun()]) : '', `${nameQuery || fake.word.noun()}-${id}`]), // nspace, displayName
        ]

        return {
          type: 'MeshHTTPRoute',
          mesh,
          name: `${displayName}${nspace.length > 0 ? `.${nspace}` : ''}`,
          creationTime: '2024-03-01T09:20:28Z',
          modificationTime: '2024-03-01T09:20:28Z',
          kri: fake.kuma.kri({ shortName, mesh, zone, namespace: nspace, name: displayName, sectionName: '' }),
          labels: {
            ...fake.kuma.labels({
              name: displayName,
              ...(zone ? { zone } : {}),
              ...(k8s ? { namespace: nspace } : {}),
            }),
          },
          spec: {
            targetRef: {
              kind: 'MeshGateway',
              name: 'demo-app',
            },
            to: [
              {
                targetRef: {
                  kind: 'Mesh',
                },
                rules: [
                  {
                    matches: Array.from({ length: ruleMatchCount }).map(() => fake.kuma.ruleMatch()),
                    default: {
                      backendRefs: [
                        {
                          kind: 'MeshService',
                          name: 'demo-app_kuma-demo_svc_5000',
                          weight: 1,
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        } satisfies MeshHTTPRoute
      }),
      next,
    },
  }
}
