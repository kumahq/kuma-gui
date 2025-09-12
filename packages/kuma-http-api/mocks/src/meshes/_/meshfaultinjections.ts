import type { Dependencies, ResponseHandler } from '#mocks'

export default ({ fake, pager, env }: Dependencies): ResponseHandler => (req) => {
  const { mesh } = req.params
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_MESHFAULTINJECTION_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    `/meshes/${mesh}/meshfaultinjections`,
  )

  const queryName = req.url.searchParams.get('name')
  const queryNamespace = req.url.searchParams.get('filter[labels.k8s.kuma.io/namespace]')

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const name = `${queryName?.padEnd(queryName.length + 1, '-') ?? ''}${fake.word.noun()}-${id}`

        const displayName = `${name}${fake.kuma.dataplaneSuffix(k8s)}`
        const nspace = queryNamespace ?? fake.k8s.namespace()
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
                'kuma.io/policy-role': fake.kuma.policyRole(),
              },
            }
            : {}),
          spec: {
            from: [
              {
                targetRef: {
                  kind: 'MeshService',
                  name: fake.word.noun(),
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
