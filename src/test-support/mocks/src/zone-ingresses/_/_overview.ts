import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, env }: EndpointDependencies): MockResponder => (req) => {
  const { name } = req.params
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  const parts = String(name).split('.')
  const displayName = parts.slice(0, -1).join('.')
  const nspace = parts.pop()

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
                generation: 409,
                status: {
                  lastUpdateTime: fake.kuma.nanodate(),
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
