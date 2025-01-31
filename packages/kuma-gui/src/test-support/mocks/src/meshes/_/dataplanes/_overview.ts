import type { EndpointDependencies, MockResponder } from '@/test-support'

export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const { mesh } = req.params
  const query = req.url.searchParams
  const _gateway = query.get('gateway') ?? ''
  const _name = query.get('name') ?? ''
  const _tags = query.get('tag') ?? ''

  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const defaultType = env('KUMA_DATAPLANE_TYPE', '')
  const inboundCount = parseInt(env('KUMA_DATAPLANEINBOUND_COUNT', `${fake.number.int({ min: 1, max: 5 })}`))
  const outboundCount = parseInt(env('KUMA_DATAPLANEOUTBOUND_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  const subscriptionCount = parseInt(env('KUMA_SUBSCRIPTION_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  const isMtlsEnabledOverride = env('KUMA_MTLS_ENABLED', '')
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_DATAPLANE_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    `/meshes/${mesh}/dataplanes/_overview`,
  )

  const tags = _tags !== ''
    ? Object.fromEntries([_tags]
      .filter((tag) => Boolean(tag))
      .map(item => { const [key, ...rest] = item.split(':'); return [key, rest.join(':')] }))
    : {}

  const filterType = (() => {
    switch (true) {
      case _gateway === 'false':
        return 'STANDARD'
      case defaultType === 'builtin':
      case _gateway === 'builtin':
        return 'BUILTIN'
      case defaultType === 'delegated':
      case _gateway === 'delegated':
      case tags['kuma.io/service']?.includes('-delegated'):
        return 'DELEGATED'
      case tags['kuma.io/service']?.includes('-builtin'):
        return 'BUILTIN'
      default:
        return ''
    }
  })()

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i

        const isMultizone = fake.datatype.boolean()
        const isMtlsEnabled = isMtlsEnabledOverride !== '' ? isMtlsEnabledOverride === 'true' : fake.datatype.boolean()

        const type = filterType || fake.helpers.arrayElement(['BUILTIN', 'DELEGATED', 'STANDARD'])
        // we include the type in the name so when we link using the name
        // we keep the type in the URL so the corresponding item mock knows the type
        const name = `${fake.word.noun()}-${type.toLowerCase()}`
        const displayName = `${_name || name}-${id}${fake.kuma.dataplaneSuffix(k8s)}`
        const nspace = fake.k8s.namespace()
        const service = tags['kuma.io/service']
        const address = fake.internet.ip()

        return {
          type: 'DataplaneOverview',
          mesh,
          name: `${displayName}${k8s ? `.${nspace}` : ''}`,
          ...((modificationTime) => ({
            creationTime: fake.kuma.date({ refDate: modificationTime }),
            modificationTime,
          }))(fake.kuma.date()),
          dataplane: {
            networking: {
              address,
              ...(fake.datatype.boolean() ? {
                advertisedAddress: fake.internet.ip(),
              } : {}),
              ...(type === 'STANDARD' ? {
                // normal proxies have inbound and outbound
                inbound: Array.from({ length: inboundCount }).map((_) => {
                  return {
                    address,
                    port: fake.number.int({ min: 1, max: 65535 }),
                    ...(fake.datatype.boolean() ? {
                      serviceAddress: fake.internet.ip(),
                    } : {}),
                    ...(fake.datatype.boolean() ? {
                      servicePort: fake.number.int({ min: 1, max: 65535 }),
                    } : {}),
                    tags: fake.kuma.tags({
                      protocol: fake.kuma.protocol(),
                      service,
                      zone: isMultizone && fake.datatype.boolean() ? fake.word.noun() : undefined,
                    }),
                    ...(fake.datatype.boolean() ? {
                      state: fake.kuma.inboundState(),
                    } : {}),
                  }
                }),
                outbound: Array.from({ length: outboundCount }).map((_, _i) => {
                  return {
                    port: fake.internet.port(),
                    tags: fake.kuma.tags({ service }),
                  }
                }),
              } : {
                // anything but normal proxies are gateways with no inbound/outbound
                gateway: {
                  tags: fake.kuma.tags({
                    service,
                    zone: isMultizone && fake.datatype.boolean() ? fake.word.noun() : undefined,
                  }),
                  type,
                },
              }),
            },
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
                id: fake.string.uuid(),
                controlPlaneInstanceId: `${fake.word.noun()}-${i}`,
                ...fake.kuma.connection(item, i, arr),
                status: (() => {
                  const xcks = fake.number.int({ min: 100, max: 500 })
                  const stats = Object.entries(fake.kuma.partitionInto(
                    {
                      cds: Number,
                      eds: Number,
                      lds: Number,
                      rds: Number,
                    }, xcks,
                  ))
                  return {
                    lastUpdateTime: fake.kuma.nanodate(),
                    total: fake.kuma.partitionInto(
                      {
                        responsesSent: xcks,
                        responsesAcknowledged: Number,
                        responsesRejected: Number,
                      }, xcks,
                    ),
                    ...stats.reduce(
                      (prev, [key, value]) => {
                        prev[key] = fake.kuma.partitionInto(
                          {
                            responsesSent: value,
                            responsesAcknowledged: Number,
                            responsesRejected: Number,
                          }, value,
                        )
                        return prev
                      },
                      {} as Record<string, {}>,
                    ),
                  }
                })(),
                version: {
                  kumaDp: {
                    version: fake.helpers.arrayElement([fake.system.semver(), 'unknown']),
                    gitTag: fake.helpers.arrayElement([fake.system.semver(), 'unknown']),
                    gitCommit: fake.helpers.arrayElement([fake.git.commitSha(), 'unknown']),
                    buildDate: fake.helpers.arrayElement([fake.kuma.date(), 'unknown']),
                    kumaCpCompatible: fake.datatype.boolean(),
                  },
                  envoy: ((version) => ({
                    version,
                    build: `${fake.git.commitSha()}/${version}/Clean/RELEASE/BoringSSL`,
                  }))(fake.system.semver()),
                  dependencies: {
                    coredns: fake.system.semver(),
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
