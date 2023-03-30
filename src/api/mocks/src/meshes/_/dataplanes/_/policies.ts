import type { EndpointDependencies, MockResponder } from '@/api/mocks/index'
export default (_deps: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  return {
    headers: {},
    body: {
      kind: 'MeshGatewayDataplane',
      gateway: {
        mesh: params.mesh,
        name: params.name,
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
                  route: params.name,
                  destinations: [
                    {
                      tags: {
                        'kuma.io/service': 'demo-app_kuma-demo_svc_5000',
                      },
                      policies: {
                        CircuitBreaker: {
                          type: 'CircuitBreaker',
                          mesh: params.mesh,
                          name: 'cb1',
                          creationTime: '2022-10-18T08:32:15Z',
                          modificationTime: '2022-10-18T08:32:15Z',
                          sources: [
                            {
                              match: {
                                'kuma.io/service': '*',
                              },
                            },
                          ],
                          destinations: [
                            {
                              match: {
                                'kuma.io/service': '*',
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
                          mesh: params.mesh,
                          name: 'retry-all-default',
                          creationTime: '2022-10-18T08:32:14Z',
                          modificationTime: '2022-10-18T08:32:14Z',
                          sources: [
                            {
                              match: {
                                'kuma.io/service': '*',
                              },
                            },
                          ],
                          destinations: [
                            {
                              match: {
                                'kuma.io/service': '*',
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
                          mesh: params.mesh,
                          name: 'timeout-all-default',
                          creationTime: '2022-10-18T08:32:15Z',
                          modificationTime: '2022-10-18T08:32:15Z',
                          sources: [
                            {
                              match: {
                                'kuma.io/service': '*',
                              },
                            },
                          ],
                          destinations: [
                            {
                              match: {
                                'kuma.io/service': '*',
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
          mesh: params.mesh,
          name: 'tl-1',
          creationTime: '2022-03-03T22:24:14Z',
          modificationTime: '2022-03-03T22:24:14Z',
          sources: [
            {
              match: {
                'kuma.io/service': '*',
              },
            },
          ],
          destinations: [
            {
              match: {
                'kuma.io/service': '*',
              },
            },
          ],
        },
        TrafficTrace: {
          type: 'TrafficTrace',
          mesh: params.mesh,
          name: 'tt-1',
          creationTime: '2022-03-03T22:25:34Z',
          modificationTime: '2022-03-03T22:25:34Z',
          selectors: [
            {
              match: {
                'kuma.io/service': '*',
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
