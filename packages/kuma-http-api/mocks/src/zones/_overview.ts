import type { Dependencies, ResponseHandler } from '#mocks'
export default ({ fake, pager, env }: Dependencies): ResponseHandler => (req) => {
  const query = req.url.searchParams
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_ZONE_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    '/zones/_overview',
  )
  const nameQuery = query.get('name')

  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const subscriptionCount = parseInt(env('KUMA_SUBSCRIPTION_COUNT', `${fake.number.int({ min: 0, max: 10 })}`))
        const zoneVersion = env('KUMA_ZONE_VERSION', fake.kuma.version())
        const shouldHaveZoneInsight = subscriptionCount !== 0 || fake.datatype.boolean()

        const id = offset + i
        const name = i === 0 ? 'zone-0' : `${nameQuery?.padEnd(nameQuery.length + 1, '-') ?? ''}${fake.word.noun()}-${id}`

        return {
          type: 'ZoneOverview',
          name,
          ...fake.kuma.timespan(),
          kri: fake.kuma.kri({ resourceName: 'Zone', zone: '', mesh: '', namespace: '', name, sectionName: '' }),
          zone: {
            enabled: fake.datatype.boolean(),
          },
          ...(shouldHaveZoneInsight && {
            zoneInsight: {
              subscriptions: Array.from({ length: subscriptionCount }).map((item, i, arr) => {
                return {
                  ...fake.kuma.connection(item, i, arr),
                  config: fake.kuma.subscriptionConfig({
                    environment: fake.helpers.arrayElement(['universal', 'kubernetes']),
                    store: {
                      type: fake.helpers.arrayElement(['memory', 'postgres', 'kubernetes']),
                    },
                  }),
                  id: fake.string.uuid(),
                  globalInstanceId: fake.word.noun(),
                  status: {
                    lastUpdateTime: fake.kuma.nanodate(),
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
                      version: zoneVersion,
                      gitTag: zoneVersion,
                      gitCommit: fake.git.commitSha(),
                      buildDate: fake.kuma.date(),
                      kumaCpGlobalCompatible: fake.datatype.boolean(),
                    },
                  },
                }
              }),
            },
          }),
        }
      }),
      next,
    },
  }
}
