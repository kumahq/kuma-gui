import type { Dependencies, ResponseHandler } from '#mocks'
export default (_deps: Dependencies): ResponseHandler => (_req) => {
  return {
    headers: {},
    body: {
      type: 'DataplaneOverview',
      mesh: 'default',
      name: 'kong-gateway-5bcc776cb4-578gc.kong',
      creationTime: '2024-03-20T15:30:18Z',
      modificationTime: '2024-03-20T15:30:18Z',
      labels: {
        'k8s.kuma.io/namespace': 'kong',
        'kuma.io/display-name': 'kong-gateway-5bcc776cb4-578gc',
      },
      dataplane: {
        networking: {
          address: '10.1.254.78',
          gateway: {
            tags: {
              app: 'kong-gateway',
              'app.kubernetes.io/component': 'app',
              'app.kubernetes.io/instance': 'kong',
              'app.kubernetes.io/managed-by': 'Helm',
              'app.kubernetes.io/name': 'gateway',
              'app.kubernetes.io/version': '3.6',
              'helm.sh/chart': 'gateway-2.38.0',
              'k8s.kuma.io/namespace': 'kong',
              'k8s.kuma.io/service-name': 'kong-gateway-admin',
              'k8s.kuma.io/service-port': '8444',
              'kuma.io/instance': 'kong-gateway-5bcc776cb4-578gc',
              'kuma.io/protocol': 'tcp',
              'kuma.io/service': 'kong-gateway-admin_kong_svc_8444',
              'kuma.io/zone': 'default',
              'pod-template-hash': '5bcc776cb4',
              version: '3.6',
            },
          },
          transparentProxying: {
            redirectPortInbound: 15006,
            redirectPortOutbound: 15001,
            redirectPortInboundV6: 15010,
          },
          admin: {
            port: 9901,
          },
        },
      },
      dataplaneInsight: {
        subscriptions: [
          {
            id: '4c08018b-7ab4-41b6-968d-5edd153e85b9',
            controlPlaneInstanceId: 'kuma-control-plane-6b5dfbbcdf-75xs6-05e3',
            connectTime: '2024-03-20T15:30:21.042756224Z',
            status: {
              lastUpdateTime: '2024-03-20T15:30:22.261415414Z',
              total: {
                responsesSent: '3',
                responsesAcknowledged: '3',
              },
              cds: {
                responsesSent: '1',
                responsesAcknowledged: '1',
              },
              eds: {
                responsesSent: '1',
                responsesAcknowledged: '1',
              },
              lds: {
                responsesSent: '1',
                responsesAcknowledged: '1',
              },
              rds: {},
            },
            version: {
              kumaDp: {
                version: '2.6.2',
                gitTag: '2.6.2',
                gitCommit: '4cef8d860e7a103b98d40a0b41c947db034a47fd',
                buildDate: '2024-03-14T17:22:46Z',
                kumaCpCompatible: true,
              },
              envoy: {
                version: '1.28.1',
                build: '0de8b2b94c75dbe8c2f897058e16d23d959783fa/1.28.1/Modified/RELEASE/BoringSSL',
                kumaDpCompatible: true,
              },
            },
            generation: 5,
          },
        ],
      },
    },
  }
}
