import type { Dependencies, ResponseHandler } from '#mocks'
import type { paths } from '@kumahq/kuma-http-api'

type MeshAccessLogResponse = paths['/meshes/{mesh}/meshaccesslogs/{name}']['get']['responses']['200']['content']['application/json']

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
    'mal', // shortName
    String(req.params.mesh), // mesh
    fake.helpers.arrayElement(['', fake.word.noun()]), // zone
    // with k8s the request.name MUST be use the correct `name.ns` format
    ...(k8s ? String(req.params.name).split('.').toReversed() : ['', String(req.params.name)]), // nspace, displayName
  ]
  const name = kri ? `${displayName}${nspace ? `.${nspace}` : ''}` : String(req.params.name)

  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
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
              backends: fake.helpers.arrayElements([
                {
                  type: 'Tcp' as const,
                  tcp: {
                    address: `${fake.internet.ip()}:${fake.internet.port()}`,
                  },
                },
                {
                  type: 'File' as const,
                  file: {
                    path: fake.helpers.arrayElement([fake.system.directoryPath(), `${fake.system.directoryPath()}/${fake.system.fileName()}.log`]),
                  },
                },
                {
                  type: 'OpenTelemetry' as const,
                  openTelemetry: {
                    endpoint: `otel-collector:${fake.internet.port()}`,
                  },
                },
              ]),
            },
          },
        ],
      },
    } satisfies MeshAccessLogResponse,
  }
}
