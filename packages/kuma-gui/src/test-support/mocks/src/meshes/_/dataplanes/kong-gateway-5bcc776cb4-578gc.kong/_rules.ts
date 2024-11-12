import type { EndpointDependencies, MockResponder } from '@/test-support'

export default (_deps: EndpointDependencies): MockResponder => (_req) => {
  return {
    headers: {},
    body: {
      httpMatches: [],
      resource: {
        mesh: 'default',
        name: 'kong-gateway-5bcc776cb4-578gc.kong',
        type: 'Dataplane',
      },
      rules: [
        {
          fromRules: [],
          toRules: [
            {
              conf: {
                idleTimeout: '1h0m0s',
                http: {
                  streamIdleTimeout: '5s',
                },
              },
              matchers: [],
              origin: [
                {
                  mesh: 'default',
                  name: 'mesh-gateways-timeout-all-default.kuma-system',
                  type: 'MeshTimeout',
                },
              ],
            },
          ],
          type: 'MeshTimeout',
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
