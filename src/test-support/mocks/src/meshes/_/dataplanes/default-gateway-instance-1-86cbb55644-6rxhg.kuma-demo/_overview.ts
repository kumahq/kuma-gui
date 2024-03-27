import type { EndpointDependencies, MockResponder } from '@/test-support'
export default (_deps: EndpointDependencies): MockResponder => (_req) => {
  return {
    headers: {},
    body: {
      type: 'DataplaneOverview',
      mesh: 'default',
      name: 'default-gateway-instance-1-86cbb55644-6rxhg.kuma-demo',
      creationTime: '2024-03-19T10:00:04Z',
      modificationTime: '2024-03-19T10:00:04Z',
      labels: {
        'k8s.kuma.io/namespace': 'kuma-demo',
        'kuma.io/display-name': 'default-gateway-instance-1-86cbb55644-6rxhg',
      },
      dataplane: {
        networking: {
          address: '10.1.254.72',
          gateway: {
            tags: {
              'kuma.io/service': 'default-gateway-instance',
              'kuma.io/zone': 'default',
            },
            type: 'BUILTIN',
          },
        },
      },
      dataplaneInsight: {
        subscriptions: [
          {
            id: '0fc2ea41-4287-4f66-81cb-45be5f4f4f36',
            controlPlaneInstanceId: 'kuma-control-plane-6bb6b45bf9-q956w-a030',
            connectTime: '2024-03-19T10:00:07.478453953Z',
            status: {
              lastUpdateTime: '2024-03-20T12:29:32.691707970Z',
              total: {
                responsesSent: '86',
                responsesAcknowledged: '114',
              },
              cds: {
                responsesSent: '20',
                responsesAcknowledged: '20',
              },
              eds: {
                responsesSent: '28',
                responsesAcknowledged: '47',
              },
              lds: {
                responsesSent: '17',
                responsesAcknowledged: '17',
              },
              rds: {
                responsesSent: '20',
                responsesAcknowledged: '29',
              },
            },
            version: {
              kumaDp: {
                version: '2.6.1',
                gitTag: '2.6.1',
                gitCommit: '7b1269d6f95722cea5c1d1edf90d5124a62960d4',
                buildDate: '2024-02-16T14:03:46Z',
                kumaCpCompatible: true,
              },
              envoy: {
                version: '1.28.1',
                build: '0de8b2b94c75dbe8c2f897058e16d23d959783fa/1.28.1/Modified/RELEASE/BoringSSL',
                kumaDpCompatible: true,
              },
            },
            generation: 362,
          },
        ],
      },

    },
  }
}
