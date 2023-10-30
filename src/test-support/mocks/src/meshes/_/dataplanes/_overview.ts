import type { EndpointDependencies, MockResponder } from '@/test-support'

export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const query = req.url.searchParams
  const _gateway = query.get('gateway') ?? ''
  const _name = query.get('name') ?? ''
  const _tags = query.get('tags') ?? ''

  const subscriptionCount = parseInt(env('KUMA_SUBSCRIPTION_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_DATAPLANE_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    `/meshes/${params.mesh}/dataplanes/_overview`,
  )

  const hasGateways = _gateway !== 'false'
  const hasSidecars = !['true', 'builtin', 'delegated'].includes(_gateway)
  const tags = _tags !== '' ? Object.fromEntries([_tags].filter(Boolean).map(item => { const [key, ...rest] = item.split(':'); return [key, rest.join(':')] })) : {}

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const isGateway = (!hasSidecars || (hasGateways && fake.datatype.boolean()))

        const isMultizone = true && fake.datatype.boolean()
        const service = tags['kuma.io/service'] ?? fake.kuma.serviceName()

        const name = `${_name || fake.kuma.dataPlaneProxyName()}${isGateway ? '-gateway' : '-proxy'}-${id}`
        const zone = isMultizone ? `${fake.hacker.noun()}-${id}` : undefined

        const issuedBackend = fake.hacker.noun()
        const supportedBackends = [issuedBackend].concat(fake.helpers.multiple(fake.hacker.noun))

        return {
          type: 'DataplaneOverview',
          mesh: params.mesh,
          name,
          creationTime: '2021-02-17T08:33:36.442044+01:00',
          modificationTime: '2021-02-17T08:33:36.442044+01:00',
          dataplane: {
            networking: {
              address: fake.internet.ip(),
              ...(isGateway && {
                gateway: {
                  tags: {
                    'kuma.io/service': service,
                    ...(zone && {
                      'kuma.io/zone': zone,
                    }),
                  },
                  type: _gateway === 'true' || _gateway === '' ? fake.helpers.arrayElement(['BUILTIN', 'DELEGATED']) : _gateway.toUpperCase(),
                },
              }),
              inbound: [
                fake.kuma.inbound(service, zone),
              ],
              outbound: [
                {
                  port: fake.internet.port(),
                  tags: {
                    'kuma.io/service': fake.kuma.serviceName(),
                  },
                },
              ],
            },
          },
          dataplaneInsight: {
            ...(
              JSON.parse(env('KUMA_MTLS_ENABLED', fake.helpers.arrayElement(['false', 'true'])))
                ? {
                  mTLS: {
                    certificateExpirationTime: fake.date.anytime(),
                    lastCertificateRegeneration: '2023-10-02T12:40:13.956741929Z',
                    certificateRegenerations: fake.number.int(),
                    issuedBackend,
                    supportedBackends,
                  },
                }
                : {}
            ),
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
