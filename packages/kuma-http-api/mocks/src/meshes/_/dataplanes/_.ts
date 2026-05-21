import type { Dependencies, ResponseHandler } from '#mocks'
export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  // this template can be called via the /_kri/kri_<shortName>_:kri endpoint or
  // the legacy endpoint
  const kri = req.params.kri ? `kri_dp_${req.params.kri}` : undefined
  const [
    _prefix,
    _shortName,
    mesh,
    zone,
    // if its not a kri (which always has a nspace, even if it's ''), or the
    // name has no '.', then, if its k8s use a random nspace, otherwise ''
    nspace = k8s ? fake.word.noun() : '',
    displayName,
  ] = kri ? kri.split('_') : [
    'kri', // prefix
    'dp', // shortName
    String(req.params.mesh), // mesh
    fake.helpers.arrayElement(['', fake.word.noun()]), // zone
    ...String(req.params.name).split('.').toReversed(), // nspace, displayName
  ]
  const name = kri ? `${displayName}${nspace ? `.${nspace}` : ''}` : String(req.params.name)

  const k8sFormat = req.url.searchParams.get('format') === 'kubernetes'

  const multizone = fake.datatype.boolean()

  const inbounds = parseInt(env('KUMA_DATAPLANEINBOUND_COUNT', `${fake.number.int({ min: 1, max: 5 })}`))

  const type = name.includes('-gateway_builtin') ? 'gateway_builtin' :
    name.includes('-gateway_delegated') ? 'gateway_delegated' :
      'proxy'


  return {
    headers: {},
    body: {
      ...(k8sFormat ? {
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
