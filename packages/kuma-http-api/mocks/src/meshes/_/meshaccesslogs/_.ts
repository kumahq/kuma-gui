import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'

export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const kri = req.params.kri ? `kri_mal_${req.params.kri}` : undefined
  const [
    _prefix,
    shortName,
    mesh,
    zone,
    nspace,
    displayName,
  ] = kri ? kri.split('_') : [
    'kri', // prefix
    'extsvc', // shortName
    String(req.params.mesh), // mesh
    fake.helpers.arrayElement(['', fake.word.noun()]), // zone
    // with k8s the request.name MUST be use the correct `name.ns` format
    ...(k8s ? String(req.params.name).split('.').toReversed() : ['', String(req.params.name)]), // nspace, displayName
  ]
  const name = kri ? `${displayName}${nspace ? `.${nspace}` : ''}` : String(req.params.name)
  const backendType = fake.helpers.arrayElement(['Tcp', 'File', 'OpenTelemetry'] as const)

  return {
    headers: {},
    body: {
      type: 'MeshAccessLog',
      mesh,
      name,
      ...fake.kuma.timespan(),
      labels: {
        ...fake.kuma.labels({
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
      } satisfies components['schemas']['MeshAccessLogItem']['spec'],
    },
  }
}
