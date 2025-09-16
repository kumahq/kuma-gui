import type { Dependencies, ResponseHandler } from '#mocks'
export default ({ fake, pager, env }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_ZONEEGRESS_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    '/zoneegresses/_overview',
  )
  const query = req.url.searchParams
  const zoneName = env('KUMA_ZONE_NAME', req.url.searchParams.get('filter[labels.kuma.io/zone]') ?? 'zone-0')

  const nameQuery = query.get('name')

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i

        const displayName = `${nameQuery?.padEnd(nameQuery.length + 1, '-') ?? ''}${fake.word.noun()}-${id}${fake.kuma.dataplaneSuffix(k8s)}`
        const nspace = fake.k8s.namespace()


        const subscriptionCount = parseInt(env('KUMA_SUBSCRIPTION_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))

        return {
          type: 'ZoneEgressOverview',
          name: `${displayName}${k8s ? `.${nspace}` : ''}`,
          creationTime: '2021-07-13T08:40:59Z',
          modificationTime: '2021-07-13T08:40:59Z',
          ...(k8s
            ? {
              labels: {
                'kuma.io/display-name': displayName,
                'k8s.kuma.io/namespace': nspace,
              },
            }
            : {}),
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
            ...(subscriptionCount !== 0
              ? {
                subscriptions: Array.from({ length: subscriptionCount }).map((item, i, arr) => {
                  return {
                    id: fake.string.uuid(),
                    controlPlaneInstanceId: fake.word.noun(),
                    ...fake.kuma.connection(item, i, arr),
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
              }
              : {}),
          },
        }
      }),
      next,
    },
  }
}
