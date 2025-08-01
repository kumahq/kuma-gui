import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { components } from '@kumahq/kuma-http-api'

type DataplaneNetworkingLayout = components['schemas']['DataplaneNetworkingLayout']
type DataplaneInbound = components['schemas']['DataplaneInbound']
type DataplaneOutbound = components['schemas']['DataplaneOutbound']

export default ({ env, fake }: EndpointDependencies): MockResponder => (req) => {
  const mesh = req.params.mesh as string
  const name = req.params.name as string
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const inboundCount = parseInt(env('KUMA_DATAPLANEINBOUND_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  const outboundCount = parseInt(env('KUMA_DATAPLANEOUTBOUND_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))

  const parts = String(name).split('.')
  const displayName = parts.slice(0, -1).join('.')
  const nspace = parts.pop()

  return {
    headers: {},
    body: {
      kri: fake.kuma.kri({
        shortName: 'dp',
        mesh,
        namespace: nspace,
        name,
        sectionName: 'default',
      }),
      labels: {
        'kuma.io/display-name': displayName,
        'kuma.io/origin': fake.kuma.origin(),
        'kuma.io/mesh': mesh || fake.word.noun(),
        'kuma.io/zone': fake.word.noun(),
        ...(k8s
          ? {
            'k8s.kuma.io/namespace': nspace,
          }
          : {}),
      },
      inbounds: Array.from({ length: inboundCount }).map((_, i) => {
        const port = fake.number.int({ min: 1, max: 65535 })
        const context = fake.helpers.arrayElement(['inbound', 'transparentproxy_passthrough_inbound'])
        const sectionName = fake.helpers.arrayElement(['default', 'httpport', port.toString(), 'ipv4', 'ipv6' ])
        return {
          kri: fake.kuma.kri({
            shortName: 'dp',
            mesh,
            namespace: nspace,
            name,
            sectionName,
          }),
          port,
          protocol: fake.helpers.arrayElement(['http', 'tcp', 'tls', 'grpc']),
          proxyResourceName: fake.kuma.contextualKri({ context, name: sectionName }),
        } satisfies DataplaneInbound
      }),
      outbounds: Array.from({ length: outboundCount }).map((_, i) => {
        const port = fake.number.int({ min: 1, max: 65535 })
        const sectionName = fake.helpers.arrayElement(['default', 'httpport', port.toString(), 'ipv4', 'ipv6' ])
        const kri = fake.kuma.kri({
          shortName: 'dp',
          mesh,
          namespace: nspace,
          name,
          sectionName,
        })
        return {
          kri,
          port,
          protocol: fake.helpers.arrayElement(['http', 'tcp', 'tls', 'grpc']),
          proxyResourceName: kri,
        } satisfies DataplaneOutbound
      }),
    } satisfies DataplaneNetworkingLayout,
  }
}
