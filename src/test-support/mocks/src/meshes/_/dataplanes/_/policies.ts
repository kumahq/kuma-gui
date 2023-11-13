import type { EndpointDependencies, MockResponder } from '@/test-support'

export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const { mesh } = req.params

  if (req.params.name.includes('-gateway_builtin')) {
    return {
      headers: {},
      body: {
        kind: 'MeshGatewayDataplane',
        gateway: {
          mesh,
          name: 'edge-gateway',
        },
        listeners: [
          {
            port: 80,
            protocol: 'HTTP',
            hosts: [
              {
                hostName: '*',
                routes: [
                  {
                    route: 'edge-gateway',
                    destinations: [
                      {
                        tags: {
                          'kuma.io/service': fake.kuma.serviceName(),
                        },
                        policies: {
                          CircuitBreaker: {
                            type: 'CircuitBreaker',
                            mesh,
                            name: 'cb1',
                            creationTime: '2022-10-18T08:32:15Z',
                            modificationTime: '2022-10-18T08:32:15Z',
                            sources: [
                              {
                                match: {
                                  'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                                },
                              },
                            ],
                            destinations: [
                              {
                                match: {
                                  'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                                },
                              },
                            ],
                            conf: {
                              thresholds: {
                                maxConnections: 1024,
                                maxPendingRequests: 1024,
                                maxRetries: 3,
                                maxRequests: 1024,
                              },
                            },
                          },
                          Retry: {
                            type: 'Retry',
                            mesh,
                            name: 'retry-all-default',
                            creationTime: '2022-10-18T08:32:14Z',
                            modificationTime: '2022-10-18T08:32:14Z',
                            sources: [
                              {
                                match: {
                                  'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                                },
                              },
                            ],
                            destinations: [
                              {
                                match: {
                                  'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                                },
                              },
                            ],
                            conf: {
                              http: {
                                numRetries: 5,
                                perTryTimeout: '16s',
                                backOff: {
                                  baseInterval: '0.025s',
                                  maxInterval: '0.250s',
                                },
                              },
                              tcp: {
                                maxConnectAttempts: 5,
                              },
                              grpc: {
                                numRetries: 5,
                                perTryTimeout: '16s',
                                backOff: {
                                  baseInterval: '0.025s',
                                  maxInterval: '0.250s',
                                },
                              },
                            },
                          },
                          Timeout: {
                            type: 'Timeout',
                            mesh,
                            name: 'timeout-all-default',
                            creationTime: '2022-10-18T08:32:15Z',
                            modificationTime: '2022-10-18T08:32:15Z',
                            sources: [
                              {
                                match: {
                                  'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                                },
                              },
                            ],
                            destinations: [
                              {
                                match: {
                                  'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                                },
                              },
                            ],
                            conf: {
                              connectTimeout: '5s',
                              tcp: {
                                idleTimeout: '3600s',
                              },
                              http: {
                                requestTimeout: '15s',
                                idleTimeout: '3600s',
                                streamIdleTimeout: '1800s',
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        policies: {
          TrafficLog: {
            type: 'TrafficLog',
            mesh,
            name: 'tl-1',
            creationTime: '2022-03-03T22:24:14Z',
            modificationTime: '2022-03-03T22:24:14Z',
            sources: [
              {
                match: {
                  'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                },
              },
            ],
            destinations: [
              {
                match: {
                  'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                },
              },
            ],
          },
          TrafficTrace: {
            type: 'TrafficTrace',
            mesh,
            name: 'tt-1',
            creationTime: '2022-03-03T22:25:34Z',
            modificationTime: '2022-03-03T22:25:34Z',
            selectors: [
              {
                match: {
                  'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                },
              },
            ],
            conf: {
              backend: 'go',
            },
          },
        },

      },
    }
  }
  return {
    headers: {},
    body: {
      kind: 'SidecarDataplane',
      total: 7,
      items: [
        {
          type: 'inbound',
          service: fake.datatype.boolean() ? fake.kuma.serviceName() : '',
          name: '192.168.0.1:80:81',
          matchedPolicies: {
            FaultInjection: [
              {
                type: 'FaultInjection',
                mesh,
                name: 'fi1.kuma-system',
                creationTime: '0001-01-01T00:00:00Z',
                modificationTime: '0001-01-01T00:00:00Z',
                sources: [
                  {
                    match: {
                      'kuma.io/service': fake.kuma.serviceName(),
                    },
                  },
                  {
                    match: {
                      'kuma.io/service': fake.kuma.serviceName(),
                    },
                  },
                ],
                destinations: [
                  {
                    match: {
                      'kuma.io/protocol': fake.kuma.protocol(),
                      'kuma.io/service': fake.kuma.serviceName(),
                    },
                  },
                ],
                conf: {
                  delay: {
                    percentage: 90,
                    value: '5s',
                  },
                },
              },
              {
                type: 'FaultInjection',
                mesh,
                name: 'web-to-backend.kuma-system',
                creationTime: '0001-01-01T00:00:00Z',
                modificationTime: '0001-01-01T00:00:00Z',
                sources: [
                  {
                    match: {
                      'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                    },
                  },
                ],
                destinations: [
                  {
                    match: {
                      'kuma.io/protocol': 'http',
                      'kuma.io/service': fake.kuma.serviceName(),
                    },
                  },
                ],
                conf: {
                  abort: {
                    percentage: 80,
                    httpStatus: 500,
                  },
                },
              },
            ],
            TrafficPermission: [
              {
                type: 'TrafficPermission',
                mesh,
                name: 'tp-1',
                creationTime: '0001-01-01T00:00:00Z',
                modificationTime: '0001-01-01T00:00:00Z',
                sources: [
                  {
                    match: {
                      'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                    },
                  },
                ],
                destinations: [
                  {
                    match: {
                      'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'outbound',
          name: '192.168.0.2:8080',
          service: fake.datatype.boolean() ? fake.kuma.serviceName() : '',
          matchedPolicies: {
            Timeout: [
              {
                type: 'Timeout',
                mesh,
                name: 'timeout-all-default',
                creationTime: '0001-01-01T00:00:00Z',
                modificationTime: '0001-01-01T00:00:00Z',
                sources: [
                  {
                    match: {
                      'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                    },
                  },
                ],
                destinations: [
                  {
                    match: {
                      'kuma.io/service': fake.kuma.serviceName(),
                    },
                  },
                ],
                conf: {
                  connectTimeout: '5s',
                  tcp: {
                    idleTimeout: '5s',
                  },
                  http: {
                    requestTimeout: '5s',
                    idleTimeout: '5s',
                  },
                  grpc: {
                    streamIdleTimeout: '5s',
                    maxStreamDuration: '5s',
                  },
                },
              },
            ],
          },
        },
        {
          type: 'service',
          name: 'gateway',
          service: fake.datatype.boolean() ? fake.kuma.serviceName() : '',
          matchedPolicies: {
            HealthCheck: [
              {
                type: 'HealthCheck',
                mesh,
                name: 'foo-bar-baz-123',
                creationTime: '0001-01-01T00:00:00Z',
                modificationTime: '0001-01-01T00:00:00Z',
                sources: [
                  {
                    match: {
                      'kuma.io/service': fake.kuma.serviceName(),
                    },
                  },
                ],
                destinations: [
                  {
                    match: {
                      'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                    },
                  },
                ],
                conf: {
                  interval: '5s',
                  timeout: '7s',
                  unhealthyThreshold: 11,
                  healthyThreshold: 9,
                },
              },
            ],
          },
        },
        {
          type: 'service',
          name: 'postgres',
          service: fake.datatype.boolean() ? fake.kuma.serviceName() : '',
          matchedPolicies: {
            HealthCheck: [
              {
                type: 'HealthCheck',
                mesh,
                name: 'foo-bar-baz-123',
                creationTime: '0001-01-01T00:00:00Z',
                modificationTime: '0001-01-01T00:00:00Z',
                sources: [
                  {
                    match: {
                      'kuma.io/service': 'backend',
                    },
                  },
                ],
                destinations: [
                  {
                    match: {
                      'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                    },
                  },
                ],
                conf: {
                  interval: '5s',
                  timeout: '7s',
                  unhealthyThreshold: 11,
                  healthyThreshold: 9,
                },
              },
            ],
          },
        },
        {
          type: 'service',
          name: 'redis',
          service: fake.datatype.boolean() ? fake.kuma.serviceName() : '',
          matchedPolicies: {
            HealthCheck: [
              {
                type: 'HealthCheck',
                mesh,
                name: 'foo-bar-baz-123',
                creationTime: '0001-01-01T00:00:00Z',
                modificationTime: '0001-01-01T00:00:00Z',
                sources: [
                  {
                    match: {
                      'kuma.io/service': 'backend',
                    },
                  },
                ],
                destinations: [
                  {
                    match: {
                      'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                    },
                  },
                ],
                conf: {
                  interval: '5s',
                  timeout: '7s',
                  unhealthyThreshold: 11,
                  healthyThreshold: 9,
                },
              },
            ],
          },
        },
        {
          type: 'service',
          name: 'web-api',
          service: fake.datatype.boolean() ? fake.kuma.serviceName() : '',
          matchedPolicies: {
            HealthCheck: [
              {
                type: 'HealthCheck',
                mesh,
                name: 'foo-bar-baz-123',
                creationTime: '0001-01-01T00:00:00Z',
                modificationTime: '0001-01-01T00:00:00Z',
                sources: [
                  {
                    match: {
                      'kuma.io/service': 'backend',
                    },
                  },
                ],
                destinations: [
                  {
                    match: {
                      'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                    },
                  },
                ],
                conf: {
                  interval: '5s',
                  timeout: '7s',
                  unhealthyThreshold: 11,
                  healthyThreshold: 9,
                },
              },
            ],
          },
        },
        {
          type: 'dataplane',
          name: '',
          service: fake.datatype.boolean() ? fake.kuma.serviceName() : '',
          matchedPolicies: {
            TrafficTrace: [
              {
                type: 'TrafficTrace',
                mesh,
                name: 'foo-bar-baz-123',
                creationTime: '0001-01-01T00:00:00Z',
                modificationTime: '0001-01-01T00:00:00Z',
                sources: [
                  {
                    match: {
                      'kuma.io/service': fake.datatype.boolean() ? fake.kuma.serviceName() : '*',
                    },
                  },
                ],
              },
            ],
          },
        },
      ],

    },
  }
}
