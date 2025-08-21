import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ env, fake }: EndpointDependencies): MockResponder => (req) => {
  const { mesh, name } = req.params

  // use a seed based on the name to keep ports and ip address the same across
  // _overview, stats and rules
  fake.kuma.seed(name as string)
  const inboundCount = parseInt(env('KUMA_DATAPLANEINBOUND_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  const ports = Array.from({ length: inboundCount }).map(() => ({
    port: fake.number.int({ min: 1, max: 65535 }),
    protocol: fake.kuma.protocol(),
  }))
  const address = fake.internet.ip()
  //

  fake.kuma.seed()
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const isMtlsEnabledOverride = env('KUMA_MTLS_ENABLED', '')
  const defaultType = env('KUMA_DATAPLANE_TYPE', '')
  const unifiedResourceNaming = env('KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED', '')
  const isTlsIssuedMeshIdentity = env('KUMA_DATAPLANE_TLS_ISSUED_MESHIDENTITY', `${fake.datatype.boolean()}`) === 'true'
  const isUnifiedResourceNamingEnabled = unifiedResourceNaming.length ? unifiedResourceNaming === 'true' : fake.datatype.boolean()

  const outboundCount = parseInt(env('KUMA_DATAPLANEOUTBOUND_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  const subscriptionCount = parseInt(env('KUMA_SUBSCRIPTION_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))

  const type = (() => {
    switch (true) {
      case defaultType === 'builtin':
      case name.includes('-builtin'):
        return 'BUILTIN'
      case defaultType === 'delegated':
      case name.includes('-delegated'):
        return 'DELEGATED'
      default:
        return 'STANDARD'
    }
  })()

  const isMultizone = fake.datatype.boolean()
  const isMtlsEnabled = isTlsIssuedMeshIdentity || (isMtlsEnabledOverride !== '' ? isMtlsEnabledOverride === 'true' : fake.datatype.boolean())

  const service = fake.word.noun()

  const parts = String(name).split('.')
  const displayName = parts.slice(0, -1).join('.')
  const nspace = parts.pop()

  return {
    headers: {},
    body: {
      type: 'DataplaneOverview',
      mesh,
      name,
      ...((modificationTime) => ({
        creationTime: fake.kuma.date({ refDate: modificationTime }),
        modificationTime,
      }))(fake.kuma.date()),
      dataplane: {
        networking: {
          address,
          ...(fake.datatype.boolean() ? {
            advertisedAddress: fake.internet.ip(),
          } : {}),
          ...(type === 'STANDARD' ? {
            // normal proxies have inbound and outbound
            inbound: Array.from({ length: inboundCount }).map((_, i) => {
              return {
                address,
                port: ports[i].port,
                // these aren't synced, if they need seed syncing please move
                // above with address
                ...(fake.datatype.boolean() ? {
                  serviceAddress: fake.internet.ip(),
                } : {}),
                ...(fake.datatype.boolean() ? {
                  servicePort: fake.number.int({ min: 1, max: 65535 }),
                } : {}),
                tags: fake.kuma.tags({
                  protocol: ports[i].protocol,
                  service,
                  zone: isMultizone && fake.datatype.boolean() ? fake.word.noun() : undefined,
                }),
                ...(fake.datatype.boolean() ? {
                  state: fake.kuma.inboundState(),
                } : {}),
                ...(fake.datatype.boolean() && { name: `${fake.word.noun()}-port` }),
              }
            }),
            outbound: Array.from({ length: outboundCount }).map((_, _i) => {
              return {
                port: fake.internet.port(),
                tags: fake.kuma.tags({ service }),
              }
            }),
          } : {
            // anything but normal proxies are gateways with no inbound/outbound
            gateway: {
              tags: fake.kuma.tags({
                service,
                zone: isMultizone && fake.datatype.boolean() ? fake.word.noun() : undefined,
              }),
              type,
            },
          }),
        },
      },
      ...(k8s
        ? {
          labels: {
            'kuma.io/display-name': displayName,
            'k8s.kuma.io/namespace': nspace,
          },
        }
        : {}),
      dataplaneInsight: {
        ...(isMtlsEnabled ? { 
          mTLS: isTlsIssuedMeshIdentity ? {
            issuedBackend: fake.kuma.kri({ shortName: 'mid', mesh: mesh as string, sectionName: '' }),
          } : fake.kuma.dataplaneMtls(),
        } : {}),
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
                kumaCpCompatible: fake.datatype.boolean(),
              },
              envoy: ((version) => ({
                version,
                build: `${fake.git.commitSha()}/${version}/Clean/RELEASE/BoringSSL`,
                kumaDpCompatible: fake.datatype.boolean(),
              }))(fake.system.semver()),
              dependencies: {
                coredns: fake.system.semver(),
              },
            },
          }
        }),
        metadata: {
          features: [
            ...fake.kuma.dataplaneFeatures(),
            ...(isUnifiedResourceNamingEnabled ? ['feature-unified-resource-naming'] : []),
          ],
        },
      },
    },
  }
}
