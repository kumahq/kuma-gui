import type { EndpointDependencies, MockResponder } from '@/test-support'
export default (_deps: EndpointDependencies): MockResponder => (_req) => {
  return {
    headers: {},
    body: {
      type: 'DataplaneOverview',
      mesh: 'default',
      name: 'grpc-service-75b4ccdfd5-z2jmp.kuma-demo',
      creationTime: '2024-03-19T09:59:55Z',
      modificationTime: '2024-03-19T09:59:55Z',
      labels: {
        'k8s.kuma.io/namespace': 'kuma-demo',
        'kuma.io/display-name': 'grpc-service-75b4ccdfd5-z2jmp',
      },
      dataplane: {
        networking: {
          address: '10.1.254.74',
          inbound: [
            {
              port: 9090,
              tags: {
                app: 'grpc-service',
                'k8s.kuma.io/namespace': 'kuma-demo',
                'k8s.kuma.io/service-name': 'grpc-service',
                'k8s.kuma.io/service-port': '9090',
                'kuma.io/protocol': 'grpc',
                'kuma.io/service': 'grpc-service_kuma-demo_svc_9090',
                'kuma.io/zone': 'default',
                'pod-template-hash': '75b4ccdfd5',
              },
              health: {
                ready: true,
              },
            },
          ],
          transparentProxying: {
            redirectPortInbound: 15006,
            redirectPortOutbound: 15001,
            redirectPortInboundV6: 15010,
          },
          admin: {
            port: 9901,
          },
        },
        probes: {
          port: 9000,
        },
      },
      dataplaneInsight: {
        subscriptions: [
          {
            id: 'c69ecbb7-94b6-4df1-8944-0bc99d00de8a',
            controlPlaneInstanceId: 'kuma-control-plane-6bb6b45bf9-q956w-a030',
            connectTime: '2024-03-19T10:00:05.142402136Z',
            status: {
              lastUpdateTime: '2024-03-19T13:04:00.417601467Z',
              total: {
                responsesSent: '42',
                responsesAcknowledged: '50',
              },
              cds: {
                responsesSent: '9',
                responsesAcknowledged: '9',
              },
              eds: {
                responsesSent: '19',
                responsesAcknowledged: '27',
              },
              lds: {
                responsesSent: '14',
                responsesAcknowledged: '14',
              },
              rds: {},
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
            generation: 408,
          },
        ],
      },

    },
  }
}
