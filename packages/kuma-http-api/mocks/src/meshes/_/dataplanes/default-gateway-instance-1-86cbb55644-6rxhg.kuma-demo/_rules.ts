import type { Dependencies, ResponseHandler } from '#mocks'

export default ({ env, fake }: Dependencies): ResponseHandler => (_req) => {
  const ruleMatchCount = parseInt(env('KUMA_RULE_MATCH_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))

  return {
    headers: {},
    body: {
      httpMatches: [
        {
          hash: '9Zuf5Tg79OuZcQITwBbQykxAk2u4fRKrwYn3//AL4Yo=',
          match: [
            {
              path: {
                value: '/',
                type: 'PathPrefix',
              },
            },
          ],
        },
        {
          hash: 'JFxWBMhUH4ocpD+wnpBjcqfRKKD3x2B0Jakf6QY2vFQ=',
          match: [
            {
              path: {
                value: '/demo',
                type: 'PathPrefix',
              },
            },
          ],
        },
      ],
      resource: {
        mesh: 'default',
        name: 'default-gateway-instance-1-86cbb55644-6rxhg.kuma-demo',
        type: 'Dataplane',
      },
      rules: [
        {
          fromRules: [],
          toRules: [
            {
              conf: {
                rules: [
                  {
                    matches: Array.from({ length: ruleMatchCount }).map(() => fake.kuma.ruleMatch()),
                    default: {
                      backendRefs: [
                        {
                          kind: 'MeshService',
                          name: 'demo-app_kuma-demo_svc_5000',
                          weight: 1,
                        },
                      ],
                    },
                  },
                  {
                    matches: Array.from({ length: ruleMatchCount }).map(() => fake.kuma.ruleMatch()),
                    default: {
                      backendRefs: [
                        {
                          kind: 'MeshService',
                          name: 'grpc-service_kuma-demo_svc_9090',
                          weight: 1,
                        },
                      ],
                    },
                  },
                ],
              },
              matchers: [],
              origin: [
                {
                  mesh: 'default',
                  name: 'default-gateway-http-route.kuma-system',
                  type: 'MeshHTTPRoute',
                },
              ],
            },
          ],
          type: 'MeshHTTPRoute',
          warnings: [],
        },
        {
          fromRules: [],
          toRules: [
            {
              conf: {
                default: {
                  backendRefs: [
                    {
                      kind: 'MeshService',
                      name: 'redis_kuma-demo_svc_6379',
                      weight: 1,
                    },
                  ],
                },
              },
              matchers: [],
              origin: [
                {
                  mesh: 'default',
                  name: 'default-gateway-tcp-route.kuma-system',
                  type: 'MeshTCPRoute',
                },
              ],
            },
          ],
          type: 'MeshTCPRoute',
          warnings: [],
        },
        {
          fromRules: [
            {
              inbound: {
                port: 8889,
                tags: {
                  'kuma.io/service': 'default-gateway-instance',
                  'kuma.io/zone': 'default',
                },
              },
              rules: [
                {
                  conf: {
                    idleTimeout: '5m0s',
                    http: {
                      streamIdleTimeout: '5s',
                      requestHeadersTimeout: '500ms',
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
            },
            {
              inbound: {
                port: 8886,
                tags: {
                  'kuma.io/service': 'default-gateway-instance',
                  'kuma.io/zone': 'default',
                },
              },
              rules: [
                {
                  conf: {
                    connectionTimeout: '4s',
                    idleTimeout: '40s',
                    http: {
                      requestTimeout: '4s',
                      streamIdleTimeout: '5s',
                      requestHeadersTimeout: '500ms',
                    },
                  },
                  matchers: [],
                  origin: [
                    {
                      mesh: 'default',
                      name: 'demo-app-2-timeout-3.kuma-system',
                      type: 'MeshTimeout',
                    },
                    {
                      mesh: 'default',
                      name: 'mesh-gateways-timeout-all-default.kuma-system',
                      type: 'MeshTimeout',
                    },
                  ],
                },
              ],
            },
            {
              inbound: {
                port: 8887,
                tags: {
                  'kuma.io/service': 'default-gateway-instance',
                  'kuma.io/zone': 'default',
                },
              },
              rules: [
                {
                  conf: {
                    idleTimeout: '5m0s',
                    http: {
                      streamIdleTimeout: '5s',
                      requestHeadersTimeout: '500ms',
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
            },
            {
              inbound: {
                port: 8888,
                tags: {
                  'kuma.io/service': 'default-gateway-instance',
                  'kuma.io/zone': 'default',
                },
              },
              rules: [
                {
                  conf: {
                    idleTimeout: '5m0s',
                    http: {
                      streamIdleTimeout: '5s',
                      requestHeadersTimeout: '500ms',
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
            },
          ],
          toRules: [
            {
              conf: {
                connectionTimeout: '3s',
                idleTimeout: '30s',
                http: {
                  requestTimeout: '3s',
                  streamIdleTimeout: '5s',
                },
              },
              matchers: [
                {
                  key: 'kuma.io/service',
                  not: false,
                  value: 'demo-app_kuma-demo_svc_5000',
                },
              ],
              origin: [
                {
                  mesh: 'default',
                  name: 'demo-app-2-timeout-2.kuma-system',
                  type: 'MeshTimeout',
                },
                {
                  mesh: 'default',
                  name: 'mesh-gateways-timeout-all-default.kuma-system',
                  type: 'MeshTimeout',
                },
              ],
            },
            {
              conf: {
                connectionTimeout: '2s',
                idleTimeout: '20s',
                http: {
                  requestTimeout: '2s',
                  streamIdleTimeout: '5s',
                },
              },
              matchers: [
                {
                  key: 'kuma.io/service',
                  not: false,
                  value: 'demo-app-2_kuma-demo_svc_5000',
                },
              ],
              origin: [
                {
                  mesh: 'default',
                  name: 'demo-app-2-timeout.kuma-system',
                  type: 'MeshTimeout',
                },
                {
                  mesh: 'default',
                  name: 'mesh-gateways-timeout-all-default.kuma-system',
                  type: 'MeshTimeout',
                },
              ],
            },
            {
              conf: {
                idleTimeout: '1h0m0s',
                http: {
                  streamIdleTimeout: '5s',
                },
              },
              matchers: [
                {
                  key: 'kuma.io/service',
                  not: true,
                  value: 'demo-app-2_kuma-demo_svc_5000',
                },
                {
                  key: 'kuma.io/service',
                  not: true,
                  value: 'demo-app_kuma-demo_svc_5000',
                },
              ],
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
          fromRules: [
            {
              inbound: {
                port: 8886,
                tags: {
                  'kuma.io/service': 'default-gateway-instance',
                  'kuma.io/zone': 'default',
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
            {
              inbound: {
                port: 8887,
                tags: {
                  'kuma.io/service': 'default-gateway-instance',
                  'kuma.io/zone': 'default',
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
            {
              inbound: {
                port: 8888,
                tags: {
                  'kuma.io/service': 'default-gateway-instance',
                  'kuma.io/zone': 'default',
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
            {
              inbound: {
                port: 8889,
                tags: {
                  'kuma.io/service': 'default-gateway-instance',
                  'kuma.io/zone': 'default',
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
