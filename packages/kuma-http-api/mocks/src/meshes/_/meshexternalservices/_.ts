import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'
type Entity = components['schemas']['MeshExternalServiceItem']

export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const query = req.url.searchParams

  const kri = req.params.kri as string | undefined
  const [
    mesh = req.params.mesh as string,
    _zone,
    _namespace,
    name = req.params.name as string
  ] = kri?.split('_') ?? ''

  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const parts = String(name).split('.')
  const displayName = parts.slice(0, -1).join('.')
  const nspace = parts.pop() ?? ''

  return {
    headers: {},
    body: {
      ...(query.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'MeshExternalService',
      mesh,
      name,
      creationTime: '2021-02-19T08:06:15.14624+01:00',
      modificationTime: '2021-02-19T08:07:37.539229+01:00',
      ...(k8s
        ? {
          labels: {
            'kuma.io/display-name': displayName,
            'k8s.kuma.io/namespace': nspace,
            'kuma.io/origin': 'zone',
            'kuma.io/zone': fake.word.noun(),
          },
        }
        : {}),
      spec: {
        match: {
          type: 'HostnameGenerator',
          port: fake.internet.port(),
          protocol: fake.kuma.protocol(),
        },
        endpoints: [
          {
            address: fake.internet.domainName(),
            port: fake.internet.port(),
          },
        ],
        tls: {
          allowRenegotiation: fake.datatype.boolean(),
          enabled: fake.datatype.boolean(),
        },
      },
      status: {
        addresses: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map(_ => ({
          hostname: fake.internet.domainName(),
        })),
        vip: {
          ip: fake.internet.ip(),
        },
      },
    } satisfies Entity & {
      creationTime: string
      modificationTime: string
    },
  }
}
