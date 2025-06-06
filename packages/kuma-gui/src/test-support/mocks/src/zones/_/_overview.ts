import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ env, fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const subscriptionCount = parseInt(env('KUMA_SUBSCRIPTION_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))

  // To test the error handling of the zone creation flow’s polling mechanism
  // use KUMA_SUBSCRIPTION_COUNT=0 in your cookies, set to
  // KUMA_SUBSCRIPTION_COUNT=1 to make it connect

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
        ...(fake.datatype.boolean()
          ? {
            enabled: true,
          }
          : {}),
      },
      zoneInsight: {
        ...(subscriptionCount !== 0
          ? {
            subscriptions: Array.from({ length: subscriptionCount }).map((item, i, arr) => {
              return {
                id: fake.string.uuid(),
                ...(fake.datatype.boolean()
                  ? {
                    globalInstanceId: `global-${fake.word.noun()}`,
                  }
                  : {}),
                zoneInstanceId: `zone-${fake.word.noun()}`,
                version: {
                  kumaCp: {
                    version: fake.kuma.version(),
                    gitTag: fake.kuma.version(),
                    gitCommit: fake.git.commitSha(),
                    buildDate: '2021-02-18T13:22:30Z',
                    kumaCpGlobalCompatible: fake.datatype.boolean(),
                  },
                },
                config: fake.kuma.subscriptionConfig({ environment: fake.helpers.arrayElement(['universal', 'kubernetes'])}),
                ...fake.kuma.connection(item, i, arr),
                status: (() => {
                  const xcks = fake.number.int({ min: 100, max: 500 })
                  const stats = Object.entries(fake.kuma.partitionInto(
                    {
                      CircuitBreaker: Number,
                      Config: Number,
                      Mesh: Number,
                      Secret: Number,
                      Dataplane: Number,
                      ExternalService: Number,
                      FaultInjection: Number,
                      HealthCheck: Number,
                      ProxyTemplate: Number,
                      Retry: Number,
                      TrafficLog: Number,
                      TrafficPermission: Number,
                      TrafficRoute: Number,
                      TrafficTrace: Number,
                    }, xcks,
                  ))
                  return {
                    lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                    total: fake.kuma.partitionInto(
                      {
                        responsesSent: xcks,
                        responsesAcknowledged: Number,
                        responsesRejected: Number,
                      }, xcks,
                    ),
                    stat: {
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
                    },
                  }
                })(),
              }
            }),
          }
          : {}),
      },
    },
  }
}
