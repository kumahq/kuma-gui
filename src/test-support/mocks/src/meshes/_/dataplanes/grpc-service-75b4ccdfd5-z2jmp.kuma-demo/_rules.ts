import type { EndpointDependencies, MockResponder } from '@/test-support'

export default (_deps: EndpointDependencies): MockResponder => (_req) => {
  return {
    headers: {},
    body: {
      httpMatches: [],
      resource: {
        mesh: 'default',
        name: 'grpc-service-75b4ccdfd5-z2jmp.kuma-demo',
        type: 'Dataplane',
      },
      rules: [
        {
          fromRules: [
            {
              inbound: {
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
              },
              rules: [
                {
                  conf: {
                    connectionTimeout: '10s',
                    idleTimeout: '2h0m0s',
                    http: {
                      requestTimeout: '0s',
                      streamIdleTimeout: '1h0m0s',
                      maxStreamDuration: '0s',
                    },
                  },
                  matchers: [],
                  origin: [
                    {
                      mesh: 'default',
                      name: 'mesh-timeout-all-default.kuma-system',
                      type: 'MeshTimeout',
                    },
                  ],
                },
              ],
            },
          ],
          toRules: [
            {
              conf: {
                connectionTimeout: '5s',
                idleTimeout: '1h0m0s',
                http: {
                  requestTimeout: '15s',
                  streamIdleTimeout: '30m0s',
                },
              },
              matchers: [],
              origin: [
                {
                  mesh: 'default',
                  name: 'mesh-timeout-all-default.kuma-system',
                  type: 'MeshTimeout',
                },
              ],
            },
          ],
          type: 'MeshTimeout',
          warnings: [],
        },
        {
          fromRules: [
            {
              inbound: {
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
              },
              rules: [
                {
                  conf: {
                    action: 'Deny',
                  },
                  matchers: [],
                  origin: [
                    {
                      mesh: 'default',
                      name: 'default-mesh-traffic-permission.kuma-system',
                      type: 'MeshTrafficPermission',
                    },
                  ],
                },
              ],
            },
          ],
          toRules: [],
          type: 'MeshTrafficPermission',
          warnings: [],
        },
        {
          fromRules: [],
          toRules: [
            {
              conf: {
                connectionLimits: {
                  maxConnections: 1024,
                  maxPendingRequests: 1024,
                  maxRetries: 3,
                  maxRequests: 1024,
                },
              },
              matchers: [],
              origin: [
                {
                  mesh: 'default',
                  name: 'mesh-circuit-breaker-all-default.kuma-system',
                  type: 'MeshCircuitBreaker',
                },
              ],
            },
          ],
          type: 'MeshCircuitBreaker',
          warnings: [],
        },
        {
          fromRules: [],
          toRules: [
            {
              conf: {
                tcp: {
                  maxConnectAttempt: 5,
                },
                http: {
                  numRetries: 5,
                  perTryTimeout: '16s',
                  backOff: {
                    baseInterval: '25ms',
                    maxInterval: '250ms',
                  },
                },
                grpc: {
                  numRetries: 5,
                  perTryTimeout: '16s',
                  backOff: {
                    baseInterval: '25ms',
                    maxInterval: '250ms',
                  },
                },
              },
              matchers: [],
              origin: [
                {
                  mesh: 'default',
                  name: 'mesh-retry-all-default.kuma-system',
                  type: 'MeshRetry',
                },
              ],
            },
          ],
          type: 'MeshRetry',
          warnings: [],
        },
      ],

    },
  }
}
