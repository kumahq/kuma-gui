import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { MeshHTTPRoute } from '@/types/index.d'

export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const mesh = req.params.mesh as string

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
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const name = `${nameQuery?.padEnd(nameQuery.length + 1, '-') ?? ''}${fake.word.noun()}-${id}`
        const zone = zoneQuery ?? fake.word.noun()

        return {
          type: 'MeshHTTPRoute',
          mesh,
          name,
          creationTime: '2024-03-01T09:20:28Z',
          modificationTime: '2024-03-01T09:20:28Z',
          ...((namespaceQuery || fake.datatype.boolean()) && {
            labels: {
              'k8s.kuma.io/namespace': namespaceQuery ?? 'kuma-system',
              'kuma.io/display-name': name,
              'kuma.io/mesh': 'default',
              'kuma.io/origin': 'zone',
              'kuma.io/zone': zone,
            },
          }),
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
