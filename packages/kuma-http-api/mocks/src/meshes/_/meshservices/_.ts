import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'
type Entity = components['schemas']['MeshServiceItem']

export default ({ fake }: Dependencies): ResponseHandler => (req) => {
  const query = req.url.searchParams

  const mesh = req.params.mesh as string
  const name = req.params.name as string

  const parts = String(name).split('.')
  const k8s = parts.length > 1
  const namespace = parts.pop()

  const proxies = fake.number.int({ min: 1, max: 120 })

  return {
    headers: {},
    body: {
      ...(query.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'MeshService',
      mesh,
      name,
      creationTime: '2021-02-19T08:06:15.14624+01:00',
      modificationTime: '2021-02-19T08:07:37.539229+01:00',
      ...(k8s
        ? {
          labels: {
            'kuma.io/display-name': parts.slice(0, -1).join('.'),
            'k8s.kuma.io/namespace': namespace!,
            'kuma.io/origin': 'zone',
            'kuma.io/zone': fake.word.noun(),
          },
        }
        : {}),
      spec: {
        ports: Array.from({ length: 5 }).map(_ => (
          {
            name: fake.helpers.arrayElement([fake.word.noun(), String(fake.internet.port())]),
            port: fake.internet.port(),
            targetPort: fake.internet.port(),
            appProtocol: fake.kuma.protocol(),
          }
        )),
        selector: {
          dataplaneTags: fake.kuma.tags({}),
        },
        state: fake.helpers.arrayElement(['Available', 'Unavailable']),
        identities: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map((_, index) => {
          const type = fake.helpers.arrayElement(['ServiceTag', 'SpiffeID'])
          return {
            type,
            value: type === 'ServiceTag' ? `${fake.word.noun()}-${index + 1}` : fake.kuma.spiffeId({ mesh, namespace, sa: name }),
          }
        }),
      },
      status: {
        addresses: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map(_ => ({
          hostname: fake.internet.domainName(),
        })),
        vips: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map(_ => ({
          ip: fake.internet.ip(),
        })),
        tls: {
          status: fake.helpers.arrayElement([undefined, 'Ready', 'NotReady']),
        },
        dataplaneProxies: {
          connected: fake.number.int({ min: 1, max: proxies }),
          healthy: fake.number.int({ min: 1, max: proxies }),
          total: proxies,
        },
      },
    } satisfies Entity & {
      creationTime: string
      modificationTime: string
    },
  }
}
