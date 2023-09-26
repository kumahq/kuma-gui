import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, env }: EndpointDependencies): MockResponder => (req) => {
  const zoneEgressName = req.params.name
  const zoneName = fake.hacker.noun()
  const subscriptionCount = parseInt(env('KUMA_SUBSCRIPTION_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))

  return {
    headers: {},
    body: {
      type: 'ZoneEgressOverview',
      name: zoneEgressName,
      creationTime: '2021-07-13T08:40:59Z',
      modificationTime: '2021-07-13T08:40:59Z',
      zoneEgress: {
        zone: zoneName,
        networking: {
          address: fake.internet.ip(),
          port: fake.internet.port(),
          admin: {
            port: fake.internet.port(),
          },
        },
      },
      zoneEgressInsight: {
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
    },
  }
}
