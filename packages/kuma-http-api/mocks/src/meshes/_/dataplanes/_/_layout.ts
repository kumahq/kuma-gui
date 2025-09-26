import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'

type DataplaneNetworkingLayout = components['schemas']['DataplaneNetworkingLayout']
type DataplaneInbound = components['schemas']['DataplaneInbound']
type DataplaneOutbound = components['schemas']['DataplaneOutbound']

export default ({ env, fake }: Dependencies): ResponseHandler => (req) => {
  const mesh = req.params.mesh as string
  const name = req.params.name as string

  const parts = String(name).split('.')
  const displayName = parts.slice(0, -1).join('.')
  const nspace = parts.pop()

  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  // use seed to sync the ports in stats.ts with the ports in _overview.ts
  fake.kuma.seed(name as string)
  const inboundCount = parseInt(env('KUMA_DATAPLANEINBOUND_COUNT', `${fake.number.int({ min: 7, max: 50 })}`))
  const inbounds = Array.from({ length: inboundCount }).map(() => ({
    port: fake.number.int({ min: 1, max: 65535 }),
    protocol: fake.kuma.protocol(),
  }))
  const outboundCount = parseInt(env('KUMA_SERVICE_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  const outbounds = Array.from({ length: outboundCount }).map(() => {
    const port = fake.number.int({ min: 1, max: 65535 })
    return {
      port,
      protocol: fake.kuma.protocol(),
      kri: fake.kuma.kri({
        shortName: fake.helpers.arrayElement(['msvc', 'mzsvc', 'extsvc']),
        mesh,
        namespace: nspace,
        name: displayName,
        sectionName: fake.helpers.arrayElement([String(port), undefined]),
      }),
    }
  })

  return {
    headers: {},
    body: {
      kri: fake.kuma.kri({
        shortName: 'dp',
        mesh,
        namespace: nspace,
        name: displayName,
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
      inbounds: inbounds.map(({ port, protocol }, i) => {
        const sectionName = fake.helpers.arrayElement(['default', 'httpport', port.toString(), 'ipv4', 'ipv6'])
        return {
          kri: fake.kuma.kri({
            shortName: 'dp',
            mesh,
            namespace: nspace,
            name: displayName,
            sectionName,
          }),
          port,
          protocol,
          proxyResourceName: fake.kuma.contextualKri({ context: fake.helpers.arrayElement(['inbound', 'inbound_dp']), name: sectionName }),
        } satisfies DataplaneInbound
      }),
      outbounds: outbounds.map(({ port, protocol, kri }, i) => {
        return {
          kri,
          port,
          protocol,
          proxyResourceName: kri,
        } satisfies DataplaneOutbound
      }),
    } satisfies DataplaneNetworkingLayout,
  }
}
