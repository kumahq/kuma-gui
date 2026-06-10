import type { Dependencies, ResponseHandler } from '#mocks'

export default ({ fake, pager, env }: Dependencies): ResponseHandler => (req) => {
  const { mesh } = req.params
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
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
        const backendType = fake.helpers.arrayElement(['Tcp', 'File', 'OpenTelemetry'] as const)
        const [
          _prefix,
          shortName,
          mesh,
          zone,
          nspace,
          displayName,
        ] = [
          'kri', // prefix
          'mtrust', // shortName
          String(req.params.mesh), // mesh
          fake.helpers.arrayElement(['', fake.word.noun()]), // zone
          ...([queryNamespace ?? (k8s ? fake.word.noun() : ''), `${queryName ? `${queryName}-` : ''}${fake.word.noun()}-${id}`]), // nspace, displayName
        ]
        const name = `${displayName}${nspace ? `.${nspace}` : ''}`
        return {
          type: 'MeshAccessLog',
          mesh,
          name: `${displayName}${k8s ? `.${nspace}` : ''}`,
          ...fake.kuma.timespan(),
          labels: {
            ...fake.kuma.labels({
              ...(name.includes('ingress') && { 'kuma.io/listener-zoneingress': 'enabled' }),
              ...(name.includes('egress') && { 'kuma.io/listener-zoneegress': 'enabled' }),
              name: displayName,
              ...(zone ? { zone } : {}),
              ...(k8s ? { namespace: nspace } : {}),
            }),
          },
          kri: fake.kuma.kri({ shortName, mesh, zone, namespace: nspace, displayName }),
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
