import type { EndpointDependencies, MockResponder } from '@/test-support'

export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const query = req.url.searchParams
  const _gateway = query.get('gateway') ?? ''
  const _name = query.get('name') ?? ''
  const _tags = query.get('tag') ?? ''

  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const inbounds = parseInt(env('KUMA_DATAPLANEINBOUND_COUNT', `${fake.number.int({ min: 1, max: 5 })}`))
  const subscriptionCount = parseInt(env('KUMA_SUBSCRIPTION_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  const isMtlsEnabledOverride = env('KUMA_MTLS_ENABLED', '')
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_DATAPLANE_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    '/dataplanes/_overview',
  )

  const tags = _tags !== ''
    ? Object.fromEntries([_tags]
      .filter((tag) => Boolean(tag))
      .map(item => { const [key, ...rest] = item.split(':'); return [key, rest.join(':')] }))
    : {}

  let filterType: 'gateway_builtin' | 'gateway_delegated' | 'proxy' | undefined
  if (_gateway === 'builtin' || _gateway === 'delegated') {
    filterType = `gateway_${_gateway}`
  } else if (_gateway === 'false') {
    filterType = 'proxy'
  } else if (tags['kuma.io/service']) {
    if (tags['kuma.io/service'].includes('gateway_builtin')) {
      filterType = 'gateway_builtin'
    } else if (tags['kuma.io/service'].includes('gateway_delegated')) {
      filterType = 'gateway_delegated'
    } else {
      filterType = 'proxy'
    }
  }

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i

        const isMultizone = fake.datatype.boolean()
        const isMtlsEnabled = isMtlsEnabledOverride !== '' ? isMtlsEnabledOverride === 'true' : fake.datatype.boolean()

        const type = filterType ?? fake.helpers.arrayElement(['gateway_builtin', 'gateway_delegated', 'proxy'])
        const mesh = `${fake.word.noun()}-${id}`
        const service = tags['kuma.io/service']

        const displayName = `${_name || fake.word.noun()}-${id}${fake.kuma.dataplaneSuffix(k8s)}`
        const nspace = fake.k8s.namespace()

        return {
          type: 'DataplaneOverview',
          mesh,
          name: `${displayName}${k8s ? `.${nspace}` : ''}`,
          creationTime: '2021-02-17T08:33:36.442044+01:00',
          modificationTime: '2021-02-17T08:33:36.442044+01:00',
          dataplane: {
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
                        service: service ?? fake.kuma.serviceName(type),
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
                        service: service ?? fake.kuma.serviceName(),
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
                    tags: fake.kuma.tags({ service: service ?? fake.kuma.serviceName() }),
                  },
                ],
              }
            })(),
          },
          ...(k8s
            ? {
              labels: {
                'kuma.io/display-name': displayName,
                'k8s.kuma.io/namespace': nspace,
              },
            }
            : {}),
          dataplaneInsight: {
            ...(isMtlsEnabled ? { mTLS: fake.kuma.dataplaneMtls() } : {}),
            subscriptions: Array.from({ length: subscriptionCount }).map((item, i, arr) => {
              return {
                id: '118b4d6f-7a98-4172-96d9-85ffb8b20b16',
                controlPlaneInstanceId: `${fake.word.noun()}-${i}`,
                ...fake.kuma.connection(item, i, arr),
                status: {
                  lastUpdateTime: '2021-02-17T10:48:03.638434Z',
                  total: {
                    responsesSent: '5',
                    responsesAcknowledged: '5',
                  },
                  cds: {
                    responsesSent: '1',
                    responsesAcknowledged: '1',
                  },
                  eds: {
                    responsesSent: '2',
                    responsesAcknowledged: '2',
                  },
                  lds: {
                    responsesSent: '2',
                    responsesAcknowledged: '2',
                  },
                  rds: {},
                },
                version: {
                  kumaDp: {
                    version: '1.0.7',
                    gitTag: 'unknown',
                    gitCommit: 'unknown',
                    buildDate: 'unknown',
                    kumaCpCompatible: fake.datatype.boolean(),
                  },
                  envoy: {
                    version: '1.16.2',
                    build: 'e98e41a8e168af7acae8079fc0cd68155f699aa3/1.16.2/Modified/DEBUG/BoringSSL',
                    kumaDpCompatible: fake.datatype.boolean(),
                  },
                  dependencies: {
                    coredns: '1.8.3',
                  },
                },
              }
            }),
          },
        }
      }),
      next,
    },
  }
}
