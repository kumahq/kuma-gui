import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, env }: EndpointDependencies): MockResponder => (req) => {
  const { name } = req.params
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  const parts = String(name).split('.')
  let displayName = parts.slice(0, -1).join('.')
  let nspace = parts.pop()

  if (displayName.length === 0) {
    displayName = String(nspace)
    nspace = ''
  }

  const zoneName = fake.hacker.noun()

  const subscriptionCount = parseInt(env('KUMA_SUBSCRIPTION_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  const serviceCount = parseInt(env('KUMA_SERVICE_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  return {
    headers: {},
    body: {
      type: 'ZoneIngressOverview',
      name,
      ...((modificationTime) => ({
        creationTime: fake.kuma.date({ refDate: modificationTime }),
        modificationTime,
      }))(fake.kuma.date()),
      ...(k8s
        ? {
          labels: {
            'kuma.io/display-name': displayName,
            'k8s.kuma.io/namespace': nspace,
          },
        }
        : {}),
      zoneIngress: {
        zone: zoneName,
        networking: {
          address: fake.internet.ip(),
          advertisedAddress: fake.internet.ip(),
          port: fake.internet.port(),
          advertisedPort: fake.internet.port(),
        },
        availableServices: Array.from({ length: serviceCount }).map(_ => {
          const mesh = `${fake.hacker.noun()}-app`
          return {
            tags: {
              app: mesh,
              'kuma.io/protocol': fake.kuma.protocol(),
              'kuma.io/service': `${mesh}_${fake.hacker.noun()}_svc_${fake.number.int({ min: 0, max: 65535 })}`,
              'kuma.io/zone': zoneName,
              'pod-template-hash': fake.string.alphanumeric({ casing: 'lower', length: 10 }),
            },
            instances: fake.number.int({ min: 1, max: 100 }),
            mesh,
          }
        }),
      },
      zoneIngressInsight: {
        ...(subscriptionCount !== 0
          ? {
            subscriptions: Array.from({ length: subscriptionCount }).map((item, i, arr) => {
              return {
                id: fake.string.uuid(),
                controlPlaneInstanceId: fake.hacker.noun(),
                ...fake.kuma.connection(item, i, arr),
                generation: fake.number.int({ min: 1, max: 500 }),
                status: (() => {
                  const xcks = fake.number.int({ min: 100, max: 500 })
                  const stats = Object.entries(fake.kuma.partitionInto(
                    {
                      cds: Number,
                      eds: Number,
                      lds: Number,
                      rds: Number,
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
                  }
                })(),
                version: {
                  kumaDp: {
                    version: fake.system.semver(),
                    gitTag: fake.system.semver(),
                    gitCommit: fake.git.commitSha(),
                    buildDate: fake.kuma.date(),
                  },
                  envoy: ((sha, version) => ({
                    version,
                    build: `${sha}/${version}/Clean/RELEASE/BoringSSL`,
                  }))(fake.git.commitSha(), fake.system.semver()),
                },

              }
            }),
          }
          : {}),
      },
    },
  }
}
