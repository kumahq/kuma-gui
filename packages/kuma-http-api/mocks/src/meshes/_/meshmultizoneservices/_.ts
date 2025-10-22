import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'
type Entity = components['schemas']['MeshMultiZoneServiceItem']

export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const query = req.url.searchParams
  
  const kri = req.params.kri as string | undefined
  const [
    mesh = req.params.mesh as string,
    _zone,
    _namespace,
    name = req.params.name as string,
  ] = kri?.split('_') ?? ''

  const parts = String(name).split('.')
  const k8s = parts.length > 1

  const serviceCount = parseInt(env('KUMA_SERVICE_COUNT', `${fake.number.int({ min: 1, max: 120 })}`))

  return {
    headers: {},
    body: {
      ...(query.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'MeshMultiZoneService',
      mesh,
      name,
      creationTime: '2021-02-19T08:06:15.14624+01:00',
      modificationTime: '2021-02-19T08:07:37.539229+01:00',
      ...(k8s
        ? {
          labels: {
            'kuma.io/display-name': parts.slice(0, -1).join('.'),
            'k8s.kuma.io/namespace': parts.pop()!,
          },
        }
        : {}),
      spec: {
        selector: {
          meshService: {
            matchLabels: fake.kuma.tags({}),
          },
        },
        ports: Array.from({ length: 5 }).map(_ => (
          {
            name: fake.helpers.arrayElement([fake.word.noun(), String(fake.internet.port())]),
            port: fake.internet.port(),
            targetPort: fake.internet.port(),
            appProtocol: fake.kuma.protocol(),
          }
        )),
      },
      status: {
        meshServices: Array.from({ length: serviceCount }).map((_, i) => ({
          name: `${fake.word.noun()}-${i}`,
          mesh: fake.word.noun(),
          namespace: `${k8s ? `${fake.k8s.namespace()}` : ''}`,
          zone: fake.word.noun(),
        })),
        addresses: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map(_ => ({
          hostname: fake.internet.domainName(),
        })),
        vips: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map(_ => ({
          ip: fake.internet.ip(),
        })),
      },
    } satisfies Entity & {
      creationTime: string
      modificationTime: string
    },
  }
}
