import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ env, fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const subscriptionCount = parseInt(env('KUMA_SUBSCRIPTION_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))

  const service = fake.kuma.serviceName()
  const isMultizone = true && fake.datatype.boolean()
  const zone = fake.hacker.noun()

  return {
    headers: {
    },
    body: {
      type: 'DataplaneOverview',
      mesh: params.mesh,
      name: params.name,
      creationTime: '2021-02-17T08:33:36.442044+01:00',
      modificationTime: '2021-02-17T08:33:36.442044+01:00',
      dataplane: {
        networking: {
          address: fake.internet.ip(),
          inbound: [
            fake.kuma.inbound(service, isMultizone ? zone : undefined),
          ],
          outbound: [
            {
              port: fake.internet.port(),
              tags: {
                'kuma.io/service': fake.kuma.serviceName(),
              },
            },
          ],
        },
      },
      dataplaneInsight: {
        subscriptions: Array.from({ length: subscriptionCount }).map((_, i) => {
          return {
            id: '118b4d6f-7a98-4172-96d9-85ffb8b20b16',
            controlPlaneInstanceId: `${fake.hacker.noun()}-${i}`,
            connectTime: '2021-02-17T07:33:36.412683Z',
            disconnectTime: fake.datatype.boolean() ? '2021-02-17T07:33:36.412683Z' : undefined,
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
        mTLS: {
          certificateExpirationTime: '2025-02-02T10:59:26.640498+01:00',
          lastCertificateRegeneration: '2021-02-02T10:59:26.640498+01:00',
          certificateRegenerations: fake.number.int({ min: 0, max: 5 }),
        },
      },
    },
  }
}
