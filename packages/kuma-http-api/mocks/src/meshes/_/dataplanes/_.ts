import type { Dependencies, ResponseHandler } from '#mocks'
export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const query = req.url.searchParams
  const { mesh, name } = req.params

  const format = query.get('format')
  const k8s = format === 'kubernetes' || (env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes')
  const multizone = fake.datatype.boolean()

  const inbounds = parseInt(env('KUMA_DATAPLANEINBOUND_COUNT', `${fake.number.int({ min: 1, max: 5 })}`))

  const parts = String(name).split('.')
  const displayName = parts.slice(0, -1).join('.')
  const nspace = parts.at(-1) ?? k8s ? fake.word.noun() : ''
  const zone = fake.word.noun()

  const type = name.includes('-gateway_builtin') ? 'gateway_builtin' :
    name.includes('-gateway_delegated') ? 'gateway_delegated' :
      'proxy'


  return {
    headers: {},
    body: {
      ...(k8s ? {
        apiVersion: 'kuma.io/v1alpha1',
      } : {}),
      type: 'Dataplane',
      mesh,
      name,
      labels: {
        ...fake.kuma.labels({
          name: displayName,
          ...(multizone ? { zone } : {}),
          ...(k8s ? { namespace: nspace } : {}),
        }),
      },
      creationTime: '2021-02-17T08:33:36.442044+01:00',
      modificationTime: '2021-02-17T08:33:36.442044+01:00',
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
                  zone: multizone && fake.datatype.boolean() ? fake.word.noun() : undefined,
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
                  zone: multizone && fake.datatype.boolean() ? fake.word.noun() : undefined,
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
