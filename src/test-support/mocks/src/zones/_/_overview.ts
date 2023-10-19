import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ env, fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const subscriptionCount = parseInt(env('KUMA_SUBSCRIPTION_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  return {
    headers: {
      'Status-Code': env('KUMA_STATUS_CODE', '200'),
    },
    body: {
      type: 'ZoneOverview',
      name: params.name,
      creationTime: '2021-02-19T08:06:15.380674+01:00',
      modificationTime: '2021-02-19T08:06:15.380674+01:00',
      zone: {
        enabled: fake.datatype.boolean(),
      },
      zoneInsight: {
        subscriptions: Array.from({ length: subscriptionCount }).map((item, i, arr) => {
          return {
            config: fake.kuma.subscriptionConfig(),
            id: fake.string.uuid(),
            globalInstanceId: fake.hacker.noun(),
            ...fake.kuma.connection(item, i, arr),
            status: {
              lastUpdateTime: '2021-02-19T07:06:16.384057Z',
              total: {
                responsesSent: `${fake.number.int(30)}`,
                responsesAcknowledged: `${fake.number.int(30)}`,
              },
              stat: {
                CircuitBreaker: {
                  responsesSent: `${fake.number.int(30)}`,
                  responsesAcknowledged: `${fake.number.int(30)}`,
                },
                Config: {
                  responsesSent: `${fake.number.int(30)}`,
                  responsesAcknowledged: `${fake.number.int(30)}`,
                },
                Dataplane: {
                  responsesSent: `${fake.number.int(30)}`,
                  responsesAcknowledged: `${fake.number.int(30)}`,
                },
                ExternalService: {
                  responsesSent: `${fake.number.int(30)}`,
                  responsesAcknowledged: `${fake.number.int(30)}`,
                },
                FaultInjection: {
                  responsesSent: `${fake.number.int(30)}`,
                  responsesAcknowledged: `${fake.number.int(30)}`,
                },
                HealthCheck: {
                  responsesSent: `${fake.number.int(30)}`,
                  responsesAcknowledged: `${fake.number.int(30)}`,
                },
                Mesh: {
                  responsesSent: `${fake.number.int(30)}`,
                  responsesAcknowledged: `${fake.number.int(30)}`,
                },
                ProxyTemplate: {
                  responsesSent: `${fake.number.int(30)}`,
                  responsesAcknowledged: `${fake.number.int(30)}`,
                },
                Retry: {
                  responsesSent: `${fake.number.int(30)}`,
                  responsesAcknowledged: `${fake.number.int(30)}`,
                },
                Secret: {
                  responsesSent: `${fake.number.int(30)}`,
                  responsesAcknowledged: `${fake.number.int(30)}`,
                },
                TrafficLog: {
                  responsesSent: `${fake.number.int(30)}`,
                  responsesAcknowledged: `${fake.number.int(30)}`,
                },
                TrafficPermission: {
                  responsesSent: `${fake.number.int(30)}`,
                  responsesAcknowledged: `${fake.number.int(30)}`,
                },
                TrafficRoute: {
                  responsesSent: `${fake.number.int(30)}`,
                  responsesAcknowledged: `${fake.number.int(30)}`,
                },
                TrafficTrace: {
                  responsesSent: `${fake.number.int(30)}`,
                  responsesAcknowledged: `${fake.number.int(30)}`,
                },
              },
            },
            version: {
              kumaCp: {
                version: '1.0.0-rc2-211-g823fe8ce',
                gitTag: '1.0.0-rc2-211-g823fe8ce',
                gitCommit: fake.git.commitSha(),
                buildDate: '2021-02-18T13:22:30Z',
                kumaCpGlobalCompatible: fake.datatype.boolean(),
              },
            },
          }
        }),
      },
    },
  }
}
