import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, env }: EndpointDependencies): MockResponder => (req) => {
  const name = req.params.name
  const mesh = req.params.mesh
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const parts = String(name).split('.')
  const displayName = parts.slice(0, -1).join('.')
  const nspace = parts.pop()

  return {
    headers: {},
    body: {
      type: 'MeshFaultInjection',
      mesh,
      name,
      creationTime: '2022-01-25T13:58:29.381342+01:00',
      modificationTime: '2022-01-25T13:58:29.381342+01:00',
      ...(k8s
        ? {
          labels: {
            'kuma.io/display-name': displayName,
            'k8s.kuma.io/namespace': nspace,
          },
        }
        : {}),
      spec: {
        targetRef: {
          kind: 'MeshService',
          name: fake.hacker.noun(),
        },
        from: [
          {
            targetRef: {
              kind: 'MeshService',
              name: fake.hacker.noun(),
            },
            default: {
              http: [
                {
                  abort: {
                    httpStatus: 500,
                    percentage: 50,
                  },
                },
              ],
            },
          },
        ],
      },
    },
  }
}
