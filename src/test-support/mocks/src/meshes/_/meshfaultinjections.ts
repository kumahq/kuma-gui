import type { EndpointDependencies, MockResponder } from '@/test-support'

export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const { mesh } = req.params
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_MESHFAULTINJECTION_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    `/meshes/${mesh}/meshfaultinjections`,
  )

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const name = `${fake.hacker.noun()}-${id}`

        const displayName = `${name}${fake.kuma.dataplaneSuffix(k8s)}`
        const nspace = fake.k8s.namespace()
        return {
          type: 'MeshFaultInjection',
          mesh,
          name: `${displayName}${k8s ? `.${nspace}` : ''}`,
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
        }
      }),
      next,
    },
  }
}
