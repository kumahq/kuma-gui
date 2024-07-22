import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { components } from '@/types/auto-generated.d'
type Entity = components['schemas']['MeshMultiZoneServiceItem']

export default ({ fake, env }: EndpointDependencies): MockResponder => (req) => {
  const query = req.url.searchParams

  const mesh = req.params.mesh as string
  const name = req.params.name as string

  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const parts = String(name).split('.')
  const displayName = parts.slice(0, -1).join('.')
  const nspace = parts.pop()!

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
            'kuma.io/display-name': displayName,
            'k8s.kuma.io/namespace': nspace,
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
        meshServices: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map(_ => ({
          name: fake.hacker.noun(),
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
