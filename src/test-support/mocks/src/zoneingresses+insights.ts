import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_ZONEINGRESS_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    '/zoneingresses+insights',
  )
  const subscriptionCount = parseInt(env('KUMA_SUBSCRIPTION_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const zoneIngressName = `${fake.hacker.noun()}-${id}`
        const zoneName = `${fake.hacker.noun()}-${id}`

        return {
          type: 'ZoneIngressOverview',
          name: zoneIngressName,
          creationTime: '2021-07-13T08:40:59Z',
          modificationTime: '2021-07-13T08:40:59Z',
          zoneIngress: {
            zone: zoneName,
            networking: {
              address: fake.internet.ip(),
              advertisedAddress: fake.internet.ip(),
              port: fake.internet.port(),
              advertisedPort: fake.internet.port(),
            },
            availableServices: [
              {
                tags: {
                  app: 'demo-app',
                  'kuma.io/protocol': fake.kuma.protocol(),
                  'kuma.io/service': 'demo-app_kuma-demo_svc_5000',
                  'kuma.io/zone': zoneName,
                  'pod-template-hash': '5845d6447b',
                },
                instances: 1,
                mesh: 'default',
              },
              {
                tags: {
                  app: 'redis',
                  'kuma.io/protocol': fake.kuma.protocol(),
                  'kuma.io/service': 'redis_kuma-demo_svc_6379',
                  'kuma.io/zone': zoneName,
                  'pod-template-hash': '59c9d56fc',
                },
                instances: 1,
                mesh: 'default',
              },
            ],
          },
          zoneIngressInsight: {
            subscriptions: Array.from({ length: subscriptionCount }).map((_, i, arr) => {
              return {
                id: fake.string.uuid(),
                controlPlaneInstanceId: fake.hacker.noun(),
                connectTime: '2021-07-13T08:41:04.556796688Z',
                ...(i === (arr.length - 1) || fake.datatype.boolean()
                  ? {
                    disconnectTime: '2021-02-17T07:33:36.412683Z',
                  }
                  : {}),
                generation: 409,
                status: {
                  lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                  total: {
                    responsesSent: `${fake.number.int(30)}`,
                    responsesAcknowledged: `${fake.number.int(30)}`,
                  },
                  cds: {
                    responsesSent: `${fake.number.int(30)}`,
                    responsesAcknowledged: `${fake.number.int(30)}`,
                  },
                  eds: {
                    responsesSent: `${fake.number.int(30)}`,
                    responsesAcknowledged: `${fake.number.int(30)}`,
                  },
                  lds: {
                    responsesSent: `${fake.number.int(30)}`,
                    responsesAcknowledged: `${fake.number.int(30)}`,
                  },
                  rds: {},
                },
                version: {
                  kumaDp: {
                    version: '1.2.1',
                    gitTag: '1.2.1',
                    gitCommit: 'e88ec407e669c47d3dc9ef32fcde60e2f31c0c4d',
                    buildDate: '2021-06-30T14:32:58Z',
                  },
                  envoy: {
                    version: '1.18.3',
                    build: '98c1c9e9a40804b93b074badad1cdf284b47d58b/1.18.3/Clean/RELEASE/BoringSSL',
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
