import type { Dependencies, ResponseHandler } from '#mocks'
export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const kri = req.params.kri as string | undefined
  const [
    mesh = req.params.mesh as string,
    zone = '',
    namespace = '',
    name = req.params.name as string,
  ] = kri?.split('_') ?? ''
  
  const inbounds = parseInt(env('KUMA_DATAPLANEINBOUND_COUNT', `${fake.number.int({ min: 1, max: 5 })}`))
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  
  let type: 'gateway_builtin' | 'gateway_delegated' | 'proxy' = 'proxy'
  if (name.includes('-gateway_builtin')) {
    type = 'gateway_builtin'
  } else if (name.includes('-gateway_delegated')) {
    type = 'gateway_delegated'
  }
  
  const isMultizone = fake.datatype.boolean() || zone.length > 0
  
  const parts = String(name).split('.')
  const displayName = parts.length > 1 ? parts.slice(0, -1).join('.') : name
  const nspace = parts.length > 1 ? parts.pop() : namespace
  
  return {
    headers: {},
    body: {
      ...(req.url.searchParams.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'Dataplane',
      mesh,
      name,
      creationTime: '2021-02-17T08:33:36.442044+01:00',
      modificationTime: '2021-02-17T08:33:36.442044+01:00',
      kri: fake.kuma.kri({ resourceName: 'Dataplane', mesh, zone, namespace: nspace, name: displayName, sectionName: '' }),
      labels: {
        'kuma.io/display-name': displayName,
        'kuma.io/mesh': mesh,
        ...(isMultizone ? {
          'kuma.io/origin': 'zone',
          'kuma.io/zone': zone || fake.word.noun(),
        } : {}),
        ...(namespace.length > 0 ?
          {
            'k8s.kuma.io/namespace': namespace,
          } : {
            ...(k8s ? { 'k8s.kuma.io/namespace': nspace || fake.k8s.namespace() } : {}),
          }
        ),
      },
      networking: (() => {
        const address = fake.internet.ipv4()
        const advertisedAddress = fake.datatype.boolean({ probability: 0.25 }) ? fake.internet.ipv4() : undefined
        const dataplaneType = type === 'gateway_builtin' ? 'BUILTIN' : type === 'gateway_delegated' ? 'DELEGATED' : undefined
  
        return {
          address,
          ...(advertisedAddress && { advertisedAddress }),
          ...(type !== 'proxy'
            ? {
              gateway: {
                tags: fake.kuma.tags({
                  service: fake.kuma.serviceName(type),
                  zone: isMultizone && fake.datatype.boolean() ? fake.word.noun() : undefined,
                }),
                ...(dataplaneType && { type: dataplaneType }),
              },
            }
            : {}),
          ...(type === 'proxy'
            ? {
              inbound: Array.from({ length: inbounds }).map(() => {
                const address = fake.datatype.boolean({ probability: 0.25 }) ? fake.internet.ipv4() : undefined
                const port = fake.internet.port()
                const hasServiceAddress = fake.datatype.boolean({ probability: 0.25 })
                const serviceAddress = hasServiceAddress ? fake.internet.ipv4() : undefined
                const servicePort = hasServiceAddress ? fake.internet.port() : undefined
                const tags = fake.kuma.tags({
                  protocol: fake.kuma.protocol(),
                  service: fake.kuma.serviceName(),
                  zone: isMultizone && fake.datatype.boolean() ? fake.word.noun() : undefined,
                })
  
                return {
                  port,
                  tags,
                  ...(fake.datatype.boolean()
                    ? {
                      health: {
                        ready: fake.datatype.boolean(),
                      },
                    }
                    : {}),
                  ...(address && { address }),
                  ...(serviceAddress && { serviceAddress }),
                  ...(servicePort && { servicePort }),
                }
              }),
            }
            : {}),
          outbound: [
            {
              port: fake.internet.port(),
              tags: fake.kuma.tags({ service: fake.kuma.serviceName() }),
            },
          ],
        }
      })(),
    },
  }
}
