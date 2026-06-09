import type { Dependencies, ResponseHandler } from '#mocks'

export default ({ fake, pager, env }: Dependencies): ResponseHandler => (req) => {
  const { mesh } = req.params
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  console.log('KUMA_MESHACCESSLOG_COUNT', env('KUMA_MESHACCESSLOG_COUNT', `${fake.number.int({ min: 1, max: 100 })}`))
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_MESHACCESSLOG_COUNT', `${fake.number.int({ min: 1, max: 100 })}`),
    req,
    `/meshes/${mesh}/meshaccesslogs`,
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
        const backendType = fake.helpers.arrayElement(['Tcp', 'File', 'OpenTelemetry'] as const)
        return {
          type: 'MeshAccessLog',
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
                  backends: [
                    backendType === 'Tcp'
                      ? { type: 'Tcp' as const, tcp: { address: `${fake.internet.ip()}:5000` } }
                      : backendType === 'File'
                        ? { type: 'File' as const, file: { path: '/tmp/access.log' } }
                        : { type: 'OpenTelemetry' as const, openTelemetry: { endpoint: 'otel-collector:4317' } },
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
