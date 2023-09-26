import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const subscriptionCount = parseInt(env('KUMA_SUBSCRIPTION_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_DATAPLANE_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    '/dataplanes+insights',
  )

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        return {
          type: 'DataplaneOverview',
          mesh: `${fake.hacker.noun()}-${id}`,
          name: `${fake.kuma.dataPlaneProxyName()}-${id}`,
          creationTime: '2021-02-17T08:33:36.442044+01:00',
          modificationTime: '2021-02-17T08:33:36.442044+01:00',
          dataplane: {
            networking: {
              address: '127.0.0.1',
              inbound: [
                fake.kuma.inbound(fake.kuma.serviceName()),
              ],
              outbound: [
                {
                  port: 10001,
                  tags: {
                    'kuma.io/service': 'frontend',
                  },
                },
              ],
            },
          },
          dataplaneInsight: {
            subscriptions: Array.from({ length: subscriptionCount }).map((_, i, arr) => {
              return {
                id: '118b4d6f-7a98-4172-96d9-85ffb8b20b16',
                controlPlaneInstanceId: `${fake.hacker.noun()}-${i}`,
                connectTime: '2021-02-17T07:33:36.412683Z',
                ...(i === (arr.length - 1) || fake.datatype.boolean()
                  ? {
                    disconnectTime: '2021-02-17T07:33:36.412683Z',
                  }
                  : {}),
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
