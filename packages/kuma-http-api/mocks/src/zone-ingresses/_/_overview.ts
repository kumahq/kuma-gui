import type { Dependencies, ResponseHandler } from '#mocks'
export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  
  const [
    zone,
    nspace,
    displayName,
  ] = [
    fake.helpers.arrayElement(['', fake.word.noun()]), // zone
    // with k8s the request.name MUST be use the correct `name.ns` format
    ...(k8s ? String(req.params.name).split('.').toReversed() : ['', String(req.params.name)]), // nspace, displayName
  ]
  const name = String(req.params.name)

  const subscriptionCount = parseInt(env('KUMA_SUBSCRIPTION_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  const serviceCount = parseInt(env('KUMA_SERVICE_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      type: 'ZoneIngressOverview',
      name,
      ...fake.kuma.timespan(),
      kri: fake.kuma.kri({ resourceName: 'ZoneEgress', mesh: '', zone, namespace: nspace, name: displayName, sectionName: '' }),
      labels: {
        ...fake.kuma.labels({
          name: displayName,
          zone,
          ...(k8s ? { namespace: nspace } : {}),
        }),
      },
      zoneIngress: {
        zone,
        networking: {
          address: fake.internet.ip(),
          advertisedAddress: fake.internet.ip(),
          port: fake.internet.port(),
          advertisedPort: fake.internet.port(),
        },
        availableServices: Array.from({ length: serviceCount }).map(_ => {
          const mesh = `${fake.word.noun()}-app`
          return {
            tags: {
              app: mesh,
              'kuma.io/protocol': fake.kuma.protocol(),
              'kuma.io/service': `${mesh}_${fake.word.noun()}_svc_${fake.number.int({ min: 0, max: 65535 })}`,
              'kuma.io/zone': zone,
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
                controlPlaneInstanceId: fake.word.noun(),
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
                    lastUpdateTime: fake.kuma.nanodate(),
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
                    version: fake.helpers.arrayElement([fake.system.semver(), 'unknown']),
                    gitTag: fake.helpers.arrayElement([fake.system.semver(), 'unknown']),
                    gitCommit: fake.helpers.arrayElement([fake.git.commitSha(), 'unknown']),
                    buildDate: fake.helpers.arrayElement([fake.kuma.date(), 'unknown']),
                  },
                  envoy: ((version) => ({
                    version,
                    build: `${fake.git.commitSha()}/${version}/Clean/RELEASE/BoringSSL`,
                  }))(fake.system.semver()),
                },
              }
            }),
          }
          : {}),
      },
    },
  }
}
