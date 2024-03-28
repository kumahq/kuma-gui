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
  const subscriptionCount = parseInt(env('KUMA_SUBSCRIPTION_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  const isMtlsEnabledOverride = env('KUMA_MTLS_ENABLED', '')

  let type: 'gateway_builtin' | 'gateway_delegated' | 'proxy' = 'proxy'
  if (name.includes('-gateway_builtin') || env('KUMA_DATAPLANE_TYPE', 'standard') === 'builtin') {
    type = 'gateway_builtin'
  } else if (name.includes('-gateway_delegated') || env('KUMA_DATAPLANE_TYPE', 'standard') === 'delegated') {
    type = 'gateway_delegated'
  }

  const isMultizone = true && fake.datatype.boolean()
  const isMtlsEnabled = isMtlsEnabledOverride !== '' ? isMtlsEnabledOverride === 'true' : fake.datatype.boolean()

  const service = fake.hacker.noun()
  const networking = {
    ...fake.kuma.dataplaneNetworking({ type, inbounds: ports.length, isMultizone, service }),
    address,
  }

  // temporarily overwrite the result of dataplaneNetworking as it doesn't
  // currently accept port plus we need to keep our ports synced.
  ;(networking.inbound ?? []).forEach((inbound, i) => {
    if (fake.datatype.boolean()) {
      inbound.port = ports[i].port
      inbound.servicePort = undefined
    } else {
      inbound.port = fake.number.int({ min: 1, max: 65535 })
      inbound.servicePort = ports[i].port
    }
    inbound.tags['kuma.io/protocol'] = ports[i].protocol
  })

  const parts = String(name).split('.')
  const displayName = parts.slice(0, -1).join('.')
  const nspace = parts.pop()

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
      ...(k8s
        ? {
          labels: {
            'kuma.io/display-name': displayName,
            'k8s.kuma.io/namespace': nspace,
          },
        }
        : {}),
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
