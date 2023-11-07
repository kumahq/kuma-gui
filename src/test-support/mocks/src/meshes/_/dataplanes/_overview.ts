import type { EndpointDependencies, MockResponder } from '@/test-support'

export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const { mesh } = req.params
  const query = req.url.searchParams
  const _gateway = query.get('gateway') ?? ''
  const _name = query.get('name') ?? ''
  const _tags = query.get('tag') ?? ''

  const inbounds = parseInt(env('KUMA_DATAPLANEINBOUND_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))
  const subscriptionCount = parseInt(env('KUMA_SUBSCRIPTION_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  const isMtlsEnabled = env('KUMA_MTLS_ENABLED', fake.helpers.arrayElement(['false', 'true'])) === 'true'
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

        const isMultizone = true && fake.datatype.boolean()

        const type = filterType ?? fake.helpers.arrayElement(['gateway_builtin', 'gateway_delegated', 'proxy'])
        const name = `${_name || fake.kuma.dataPlaneProxyName()}-${type}-${id}`
        const service = tags['kuma.io/service']

        return {
          type: 'DataplaneOverview',
          mesh,
          name,
          creationTime: '2021-02-17T08:33:36.442044+01:00',
          modificationTime: '2021-02-17T08:33:36.442044+01:00',
          dataplane: {
            networking: fake.kuma.dataplaneNetworking({ type, inbounds, isMultizone, service }),
          },
          dataplaneInsight: {
            ...(isMtlsEnabled ? { mTLS: fake.kuma.dataplaneMtls() } : {}),
            subscriptions: Array.from({ length: subscriptionCount }).map((item, i, arr) => {
              return {
                id: '118b4d6f-7a98-4172-96d9-85ffb8b20b16',
                controlPlaneInstanceId: `${fake.hacker.noun()}-${i}`,
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
