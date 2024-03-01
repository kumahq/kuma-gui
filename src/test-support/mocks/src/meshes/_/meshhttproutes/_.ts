import type { EndpointDependencies, MockResponder } from '@/test-support'
import { MeshHTTPRoute } from '@/types'

export default ({ env, fake }: EndpointDependencies): MockResponder => (req) => {
  const name = req.params.name as string
  const mesh = req.params.mesh as string

  const ruleMatchCount = parseInt(env('KUMA_RULE_MATCH_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))
  return {
    headers: {},
    body: {
      ...(req.url.searchParams.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'MeshHTTPRoute',
      mesh,
      name,
      creationTime: '2024-03-01T09:20:28Z',
      modificationTime: '2024-03-01T09:20:28Z',
      ...(fake.datatype.boolean() && {
        labels: {
          'k8s.kuma.io/namespace': 'kuma-system',
          'kuma.io/display-name': 'demo-app',
          'kuma.io/mesh': 'default',
          'kuma.io/origin': 'zone',
          'kuma.io/zone': fake.hacker.noun(),
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
    } satisfies MeshHTTPRoute,
  }
}
