import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ env, fake }: EndpointDependencies): MockResponder => (req) => {
  const { mesh, name } = req.params
  // sync the seed by name (temp use length until we get seed(str))
  fake.seed(name.length)

  const inboundCount = parseInt(env('KUMA_DATAPLANEINBOUND_COUNT', `${fake.number.int({ min: 1, max: 5 })}`))
  const ports = Array.from({ length: inboundCount }).map(() => fake.number.int({ min: 1, max: 65535 }))

  const subscriptionCount = parseInt(env('KUMA_SUBSCRIPTION_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  const isMtlsEnabledOverride = env('KUMA_MTLS_ENABLED', '')

  let type: 'gateway_builtin' | 'gateway_delegated' | 'proxy' = 'proxy'
  if (name.includes('-gateway_builtin')) {
    type = 'gateway_builtin'
  } else if (name.includes('-gateway_delegated')) {
    type = 'gateway_delegated'
  }

  const isMultizone = true && fake.datatype.boolean()
  const isMtlsEnabled = isMtlsEnabledOverride !== '' ? isMtlsEnabledOverride === 'true' : fake.datatype.boolean()

  // temporarily overwrite the result of dataplaneNetworking as it doesn't
  // currently accept port plus we need to keep our ports synced. Also, I'm not
  // totally sure on the pattern for the service name
  const networking = fake.kuma.dataplaneNetworking({ type, inbounds: ports.length, isMultizone });
  (networking.inbound ?? []).forEach((inbound, i) => {
    inbound.port = ports[i]
    inbound.tags['kuma.io/service'] = `${fake.hacker.noun()}_svc_${inbound.port}`
  })
  //
  return {
    headers: {},
    body: {
      type: 'DataplaneOverview',
      mesh,
      name,
      creationTime: '2021-02-17T08:33:36.442044+01:00',
      modificationTime: '2021-02-17T08:33:36.442044+01:00',
      dataplane: {
        networking,
      },
      dataplaneInsight: {
        ...(isMtlsEnabled ? { mTLS: fake.kuma.dataplaneMtls() } : {}),
        subscriptions: Array.from({ length: subscriptionCount }).map((item, i, arr) => {
          return {
            id: '118b4d6f-7a98-4172-96d9-85ffb8b20b16',
            controlPlaneInstanceId: `${fake.hacker.noun()}-${i}`,
            ...fake.kuma.connection(item, i, arr),
            status: {
              lastUpdateTime: '2021-02-17T10:48:03.638434Z',
              total: {
                responsesSent: '5',
                responsesAcknowledged: '5',
              },
              cds: {
                responsesSent: '1',
                responsesAcknowledged: '1',
              },
              eds: {
                responsesSent: '2',
                responsesAcknowledged: '2',
              },
              lds: {
                responsesSent: '2',
                responsesAcknowledged: '2',
              },
              rds: {},
            },
            version: {
              kumaDp: {
                version: '1.0.7',
                gitTag: 'unknown',
                gitCommit: 'unknown',
                buildDate: 'unknown',
                kumaCpCompatible: fake.datatype.boolean(),
              },
              envoy: {
                version: '1.16.2',
                build: 'e98e41a8e168af7acae8079fc0cd68155f699aa3/1.16.2/Modified/DEBUG/BoringSSL',
                kumaDpCompatible: fake.datatype.boolean(),
              },
              dependencies: {
                coredns: '1.8.3',
              },
            },
          }
        }),
      },
    },
  }
}
