import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'

export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const kri = req.params.kri as string | undefined
  const [
    mesh = req.params.mesh as string,
    _zone,
    ns,
    name = req.params.name as string,
  ] = kri?.split('_') ?? ''

  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const parts = String(name).split('.')
  const displayName = parts.slice(0, -1).join('.')
  const nspace = ns ?? parts.at(-1) ?? ''
  const backendType = fake.helpers.arrayElement(['Tcp', 'File', 'OpenTelemetry'] as const)

  return {
    headers: {},
    body: {
      type: 'MeshAccessLog',
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
