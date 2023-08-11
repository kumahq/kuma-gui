import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
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
          name: `${fake.hacker.noun()}-${id}`,
          creationTime: '2021-02-17T08:33:36.442044+01:00',
          modificationTime: '2021-02-17T08:33:36.442044+01:00',
          dataplane: {
            networking: {
              address: '127.0.0.1',
              inbound: [
                {
                  port: 7776,
                  servicePort: 7777,
                  serviceAddress: '127.0.0.1',
                  tags: {
                    'kuma.io/protocol': 'http',
                    'kuma.io/service': 'backend',
                  },
                },
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
            subscriptions: [
              {
                id: '118b4d6f-7a98-4172-96d9-85ffb8b20b16',
                controlPlaneInstanceId: 'foo',
                connectTime: '2021-02-17T07:33:36.412683Z',
                disconnectTime: fake.datatype.boolean() ? '2021-02-17T07:33:36.412683Z' : undefined,
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
                  },
                  envoy: {
                    version: '1.16.2',
                    build: 'e98e41a8e168af7acae8079fc0cd68155f699aa3/1.16.2/Modified/DEBUG/BoringSSL',
                  },
                  dependencies: {
                    coredns: '1.8.3',
                  },
                },
              },
              {
                id: '118b4d6f-7a98-4172-96d9-85ffb8b20b16',
                controlPlaneInstanceId: 'foo',
                connectTime: '2021-02-17T07:33:36.412683Z',
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
                    kumaCpCompatible: true,
                  },
                  envoy: {
                    version: '1.16.2',
                    build: 'e98e41a8e168af7acae8079fc0cd68155f699aa3/1.16.2/Modified/DEBUG/BoringSSL',
                    kumaDpCompatible: true,
                  },
                  dependencies: {
                    coredns: '1.8.3',
                  },
                },
              },
            ],
          },
        }
      }),
      next,
    },
  }
}
