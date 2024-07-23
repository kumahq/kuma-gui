import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { components } from '@/types/auto-generated.d'
type Entity = components['schemas']['MeshMultiZoneServiceItem']

export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const query = req.url.searchParams

  const mesh = req.params.mesh as string
  const name = req.params.name as string

  const parts = String(name).split('.')
  const k8s = parts.length > 1

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
      },
      status: {
        ports: Array.from({ length: 5 }).map(_ => (
          {
            port: fake.internet.port(),
            targetPort: fake.internet.port(),
            appProtocol: fake.kuma.protocol(),
          }
        )),
        meshServices: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map((_, i) => {
          return {
            name: `${fake.hacker.noun()}-${i}${k8s ? `.${fake.k8s.namespace()}` : ''}`,
          }
        }),
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
