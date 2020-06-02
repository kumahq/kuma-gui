export default class Mock {
  constructor (axios) {
    var MockAdapter = require('axios-mock-adapter')

    const mockDelay = 0

    this.mock = new MockAdapter(axios, { delayResponse: mockDelay })
    this.mock.injectMocks = () => { return this.mock }
  }

  setupPluginMocks () {
    this.mock
      .injectMocks() // additional mocks added from RestClient
      .onAny().passThrough()
  }

  setupMockEndpoints () {
    console.warn('%c ✨You are mocking api requests.',
      'background: gray; color: white; display: block; padding: 0.25rem;')

    this.mock
      // .onGet('/meshes').reply(200, {
      //   items: [
      //     {
      //       mtls: {
      //         ca: {
      //           builtin: {}
      //         }
      //       },
      //       name: 'default',
      //       type: 'Mesh'
      //     },
      //     {
      //       mtls: {
      //         ca: {
      //           builtin: {}
      //         }
      //       },
      //       name: 'mesh-01',
      //       type: 'Mesh'
      //     },
      //     {
      //       mtls: {
      //         ca: {
      //           builtin: {}
      //         }
      //       },
      //       name: 'kong-mania-12',
      //       type: 'Mesh'
      //     },
      //     {
      //       mtls: {
      //         ca: {
      //           builtin: {}
      //         }
      //       },
      //       name: 'hello-world',
      //       type: 'Mesh'
      //     }
      //   ]
      // })
      // .onGet('/meshes/default').reply(200, {
      //   type: 'Mesh',
      //   name: 'default',
      //   mtls: {
      //     ca: {
      //       builtin: {}
      //     }
      //   }
      // })
      // .onGet('/meshes/mesh-01').reply(200, {
      //   type: 'Mesh',
      //   name: 'mesh-01',
      //   mtls: {
      //     ca: {
      //       builtin: {}
      //     }
      //   }
      // })
      // .onGet('/meshes/kong-mania-12').reply(200, {
      //   type: 'Mesh',
      //   name: 'kong-mania-12',
      //   mtls: {
      //     ca: {
      //       builtin: {}
      //     }
      //   }
      // })
      // .onGet('/meshes/hello-world').reply(200, {
      //   type: 'Mesh',
      //   name: 'hello-world',
      //   mtls: {
      //     ca: {
      //       builtin: {}
      //     }
      //   }
      // })
      .onGet('/dataplanes').reply(200, {
        items: [
          {
            mesh: 'default',
            name: 'hello-world-foobar-002',
            networking: {},
            type: 'Dataplane'
          }
        ]
      })
      .onGet('/meshes/default/dataplanes/hello-world-foobar-002').reply(200, {
        items: [
          {
            mesh: 'default',
            name: 'hello-world-foobar-002',
            networking: {},
            type: 'Dataplane'
          }
        ]
      })
      .onGet('/meshes/default/dataplanes/hello-world-foobar-002').reply(200, {
        type: 'Dataplane',
        mesh: 'default',
        name: 'hello-world-foobar-002',
        creationTime: '2020-06-02T09:33:09.208372-04:00',
        modificationTime: '2020-06-02T09:33:09.208372-04:00',
        networking: {
          address: '10.0.0.1',
          inbound: [
            {
              port: 10000,
              servicePort: 9000,
              tags: {
                protocol: 'tcp',
                service: 'fancy-service-dataplane'
              }
            }
          ]
        }
      })
      .onGet('/meshes/default/dataplanes+insights/hello-world-foobar-002').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'hello-world-foobar-002',
        dataplane: {
          networking: {
            address: '172.21.0.5',
            inbound: [
              {
                port: 7070,
                servicePort: 7070,
                tags: {
                  env: 'dev',
                  service: 'kuma-example-backend',
                  tag01: 'value01',
                  reallyLongTagLabelHere: 'a-really-long-tag-value-here'
                }
              }
            ]
          }
        },
        dataplaneInsight: {
          subscriptions: [
            {
              id: '426fe0d8-f667-11e9-b081-acde48001122',
              controlPlaneInstanceId: '06070748-f667-11e9-b081-acde48001122',
              connectTime: '2019-10-24T14:04:56.820350Z',
              status: {
                lastUpdateTime: '2019-10-24T14:04:57.832482Z',
                total: {
                  responsesSent: '3',
                  responsesAcknowledged: '3'
                },
                cds: {
                  responsesSent: '1',
                  responsesAcknowledged: '1'
                },
                eds: {
                  responsesSent: '1',
                  responsesAcknowledged: '1'
                },
                lds: {
                  responsesSent: '1',
                  responsesAcknowledged: '1'
                },
                rds: {}
              }
            }
          ],
          mTSL: {
            certificateExpirationTime: '2020-05-11T16:53:55Z',
            lastCertificateRegeneration: '2020-05-11T16:53:40.862241Z',
            certificateRegenerations: 2
          }
        }
      })
      .onGet('/meshes/default/traffic-traces').reply(200, {
        items: [
          {
            type: 'TrafficTrace',
            mesh: 'default',
            name: 'tt-1',
            selectors: [
              {
                match: {
                  service: '*'
                }
              }
            ],
            conf: {
              backend: 'my-zipkin'
            }
          },
          {
            type: 'TrafficTrace',
            mesh: 'default',
            name: 'traffic-trace-02',
            selectors: [
              {
                match: {
                  service: '*'
                }
              }
            ],
            conf: {
              backend: 'my-zipkin'
            }
          },
          {
            type: 'TrafficTrace',
            mesh: 'default',
            name: 'tt-3',
            selectors: [
              {
                match: {
                  service: '*'
                }
              }
            ],
            conf: {
              backend: 'my-zipkin'
            }
          }
        ]
      })
      .onGet('/traffic-traces').reply(200, {
        items: [
          {
            type: 'TrafficTrace',
            mesh: 'helloworld',
            name: 'tt-123',
            selectors: [
              {
                match: {
                  service: '*'
                }
              }
            ],
            conf: {
              backend: 'my-zipkin'
            }
          },
          {
            type: 'TrafficTrace',
            mesh: 'my-silly-mesh-name',
            name: 'tt-tango-bravo-alpha-charlie-12',
            selectors: [
              {
                match: {
                  service: '*'
                }
              }
            ],
            conf: {
              backend: 'my-zipkin'
            }
          },
          {
            type: 'TrafficTrace',
            mesh: 'default',
            name: 'tt-1',
            selectors: [
              {
                match: {
                  service: '*'
                }
              }
            ],
            conf: {
              backend: 'my-zipkin'
            }
          },
          {
            type: 'TrafficTrace',
            mesh: 'default',
            name: 'traffic-trace-02',
            selectors: [
              {
                match: {
                  service: '*'
                }
              }
            ],
            conf: {
              backend: 'my-zipkin'
            }
          },
          {
            type: 'TrafficTrace',
            mesh: 'default',
            name: 'tt-3',
            selectors: [
              {
                match: {
                  service: '*'
                }
              }
            ],
            conf: {
              backend: 'my-zipkin'
            }
          }
        ]
      })
      .onGet('/meshes/default/health-checks').reply(200, {
        items: [
          {
            type: 'HealthCheck',
            mesh: 'default',
            name: 'web-to-backend',
            sources: [
              {
                match: {
                  service: 'web'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              activeChecks: {
                interval: '10s',
                timeout: '2s',
                unhealthyThreshold: 3,
                healthyThreshold: 1
              }
            }
          },
          {
            type: 'HealthCheck',
            mesh: 'default',
            name: 'web-to-banana',
            sources: [
              {
                match: {
                  service: 'web'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              activeChecks: {
                interval: '10s',
                timeout: '2s',
                unhealthyThreshold: 3,
                healthyThreshold: 1
              }
            }
          },
          {
            type: 'HealthCheck',
            mesh: 'default',
            name: 'hello-health-check',
            sources: [
              {
                match: {
                  service: 'web'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              activeChecks: {
                interval: '10s',
                timeout: '2s',
                unhealthyThreshold: 3,
                healthyThreshold: 1
              }
            }
          },
          {
            type: 'HealthCheck',
            mesh: 'default',
            name: 'testing-health-checks',
            sources: [
              {
                match: {
                  service: 'web'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              activeChecks: {
                interval: '10s',
                timeout: '2s',
                unhealthyThreshold: 3,
                healthyThreshold: 1
              }
            }
          },
          {
            type: 'HealthCheck',
            mesh: 'default',
            name: 'health-check-0023',
            sources: [
              {
                match: {
                  service: 'web'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              activeChecks: {
                interval: '10s',
                timeout: '2s',
                unhealthyThreshold: 3,
                healthyThreshold: 1
              }
            }
          },
          {
            type: 'HealthCheck',
            mesh: 'default',
            name: 'health-check-12345',
            sources: [
              {
                match: {
                  service: 'web'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              activeChecks: {
                interval: '10s',
                timeout: '2s',
                unhealthyThreshold: 3,
                healthyThreshold: 1
              }
            }
          },
          {
            type: 'HealthCheck',
            mesh: 'default',
            name: 'foo-bar-baz-123',
            sources: [
              {
                match: {
                  service: 'web'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              activeChecks: {
                interval: '10s',
                timeout: '2s',
                unhealthyThreshold: 3,
                healthyThreshold: 1
              }
            }
          }
        ]
      })
      .onGet('/meshes/default/health-checks/web-to-backend').reply(200, {
        type: 'HealthCheck',
        mesh: 'default',
        name: 'web-to-backend',
        sources: [
          {
            match: {
              service: 'web'
            }
          }
        ],
        destinations: [
          {
            match: {
              service: 'backend'
            }
          }
        ],
        conf: {
          activeChecks: {
            interval: '10s',
            timeout: '2s',
            unhealthyThreshold: 3,
            healthyThreshold: 1
          }
        }
      })
      .onGet('/meshes/default/health-checks/web-to-banana').reply(200, {
        type: 'HealthCheck',
        mesh: 'default',
        name: 'web-to-banana',
        sources: [
          {
            match: {
              service: 'web'
            }
          }
        ],
        destinations: [
          {
            match: {
              service: 'backend'
            }
          }
        ],
        conf: {
          activeChecks: {
            interval: '10s',
            timeout: '2s',
            unhealthyThreshold: 123,
            healthyThreshold: 12
          }
        }
      })
      .onGet('/meshes/default/health-checks/hello-health-check').reply(200, {
        type: 'HealthCheck',
        mesh: 'default',
        name: 'hello-health-check',
        sources: [
          {
            match: {
              service: 'web'
            }
          }
        ],
        destinations: [
          {
            match: {
              service: 'backend'
            }
          }
        ],
        conf: {
          activeChecks: {
            interval: '10s',
            timeout: '2s',
            unhealthyThreshold: 3,
            healthyThreshold: 4
          }
        }
      })
      .onGet('/meshes/default/health-checks/testing-health-checks').reply(200, {
        type: 'HealthCheck',
        mesh: 'default',
        name: 'testing-health-checks',
        sources: [
          {
            match: {
              service: 'web'
            }
          }
        ],
        destinations: [
          {
            match: {
              service: 'backend'
            }
          }
        ],
        conf: {
          activeChecks: {
            interval: '10s',
            timeout: '2s',
            unhealthyThreshold: 3,
            healthyThreshold: 4
          }
        }
      })
      .onGet('/meshes/default/health-checks/health-check-0023').reply(200, {
        type: 'HealthCheck',
        mesh: 'default',
        name: 'health-check-0023',
        sources: [
          {
            match: {
              service: 'web'
            }
          }
        ],
        destinations: [
          {
            match: {
              service: 'backend'
            }
          }
        ],
        conf: {
          activeChecks: {
            interval: '10s',
            timeout: '2s',
            unhealthyThreshold: 3,
            healthyThreshold: 4
          }
        }
      })
      .onGet('/meshes/default/health-checks/health-check-12345').reply(200, {
        type: 'HealthCheck',
        mesh: 'default',
        name: 'health-check-12345',
        sources: [
          {
            match: {
              service: 'web'
            }
          }
        ],
        destinations: [
          {
            match: {
              service: 'backend'
            }
          }
        ],
        conf: {
          activeChecks: {
            interval: '10s',
            timeout: '2s',
            unhealthyThreshold: 3,
            healthyThreshold: 4
          }
        }
      })
      .onGet('/meshes/default/health-checks/foo-bar-baz-123').reply(200, {
        type: 'HealthCheck',
        mesh: 'default',
        name: 'foo-bar-baz-123',
        sources: [
          {
            match: {
              service: 'web'
            }
          }
        ],
        destinations: [
          {
            match: {
              service: 'backend'
            }
          }
        ],
        conf: {
          activeChecks: {
            interval: '10s',
            timeout: '2s',
            unhealthyThreshold: 3,
            healthyThreshold: 4
          }
        }
      })
      .onGet('/health-checks').reply(200, {
        items: [
          {
            type: 'HealthCheck',
            mesh: 'default',
            name: 'web-to-backend',
            sources: [
              {
                match: {
                  service: 'web'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              activeChecks: {
                interval: '10s',
                timeout: '2s',
                unhealthyThreshold: 3,
                healthyThreshold: 1
              }
            }
          },
          {
            type: 'HealthCheck',
            mesh: 'test-mesh',
            name: 'web-to-banana',
            sources: [
              {
                match: {
                  service: 'web'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              activeChecks: {
                interval: '10s',
                timeout: '2s',
                unhealthyThreshold: 3,
                healthyThreshold: 1
              }
            }
          },
          {
            type: 'HealthCheck',
            mesh: 'helloworld',
            name: 'hello-health-check',
            sources: [
              {
                match: {
                  service: 'web'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              activeChecks: {
                interval: '10s',
                timeout: '2s',
                unhealthyThreshold: 3,
                healthyThreshold: 1
              }
            }
          },
          {
            type: 'HealthCheck',
            mesh: 'another-test-mesh',
            name: 'testing-health-checks',
            sources: [
              {
                match: {
                  service: 'web'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              activeChecks: {
                interval: '10s',
                timeout: '2s',
                unhealthyThreshold: 3,
                healthyThreshold: 1
              }
            }
          },
          {
            type: 'HealthCheck',
            mesh: 'default',
            name: 'health-check-0023',
            sources: [
              {
                match: {
                  service: 'web'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              activeChecks: {
                interval: '10s',
                timeout: '2s',
                unhealthyThreshold: 3,
                healthyThreshold: 1
              }
            }
          },
          {
            type: 'HealthCheck',
            mesh: 'default',
            name: 'health-check-12345',
            sources: [
              {
                match: {
                  service: 'web'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              activeChecks: {
                interval: '10s',
                timeout: '2s',
                unhealthyThreshold: 3,
                healthyThreshold: 1
              }
            }
          },
          {
            type: 'HealthCheck',
            mesh: 'default',
            name: 'foo-bar-baz-123',
            sources: [
              {
                match: {
                  service: 'web'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              activeChecks: {
                interval: '10s',
                timeout: '2s',
                unhealthyThreshold: 3,
                healthyThreshold: 1
              }
            }
          }
        ]
      })
      .onGet('/meshes/default/fault-injections').reply(200, {
        items: [
          {
            type: 'FaultInjection',
            mesh: 'default',
            name: 'web-to-backend.kuma-system',
            sources: [
              {
                match: {
                  service: 'web'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              delay: {
                percentage: 50,
                value: '0.010s'
              },
              abort: {
                percentage: 40,
                httpStatus: 500
              },
              responseBandwidth: {
                percentage: 40,
                limit: '50kbps'
              }
            }
          },
          {
            type: 'FaultInjection',
            mesh: 'default',
            name: 'fi1.kuma-system',
            sources: [
              {
                match: {
                  service: '*'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: '*'
                }
              }
            ],
            conf: {
              delay: {
                percentage: 50,
                value: '0.010s'
              },
              abort: {
                percentage: 40,
                httpStatus: 500
              },
              responseBandwidth: {
                percentage: 40,
                limit: '50kbps'
              }
            }
          }
        ]
      })
      .onGet('/meshes/default/fault-injections/web-to-backend.kuma-system').reply(200, {
        type: 'FaultInjection',
        mesh: 'default',
        name: 'web-to-backend.kuma-system',
        sources: [
          {
            match: {
              service: 'web'
            }
          }
        ],
        destinations: [
          {
            match: {
              service: 'backend'
            }
          }
        ],
        conf: {
          delay: {
            percentage: 50,
            value: '0.010s'
          },
          abort: {
            percentage: 40,
            httpStatus: 500
          },
          responseBandwidth: {
            percentage: 40,
            limit: '50kbps'
          }
        }
      })
      .onGet('/meshes/default/fault-injections/fi1.kuma-system').reply(200, {
        type: 'FaultInjection',
        mesh: 'default',
        name: 'fi1.kuma-system',
        sources: [
          {
            match: {
              service: 'web'
            }
          }
        ],
        destinations: [
          {
            match: {
              service: 'backend'
            }
          }
        ],
        conf: {
          delay: {
            percentage: 50,
            value: '0.010s'
          },
          abort: {
            percentage: 40,
            httpStatus: 500
          },
          responseBandwidth: {
            percentage: 40,
            limit: '50kbps'
          }
        }
      })
      .onGet('/fault-injections').reply(200, {
        items: [
          {
            type: 'FaultInjection',
            mesh: 'default',
            name: 'web-to-backend.kuma-system',
            sources: [
              {
                match: {
                  service: 'web'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              delay: {
                percentage: 50,
                value: '0.010s'
              },
              abort: {
                percentage: 40,
                httpStatus: 500
              },
              responseBandwidth: {
                percentage: 40,
                limit: '50kbps'
              }
            }
          },
          {
            type: 'FaultInjection',
            mesh: 'default',
            name: 'fi1.kuma-system',
            sources: [
              {
                match: {
                  service: '*'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: '*'
                }
              }
            ],
            conf: {
              delay: {
                percentage: 50,
                value: '0.010s'
              },
              abort: {
                percentage: 40,
                httpStatus: 500
              },
              responseBandwidth: {
                percentage: 40,
                limit: '50kbps'
              }
            }
          }
        ]
      })
      .onGet('/proxytemplates').reply(200, {
        items: [
          {
            type: 'ProxyTemplate',
            mesh: 'default',
            name: 'pt-1',
            selectors: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              imports: [
                'default-proxy'
              ],
              resources: [
                {
                  name: 'raw-name',
                  version: 'raw-version',
                  resource: "'@type': type.googleapis.com/envoy.api.v2.Cluster\nconnectTimeout: 5s\nloadAssignment:\n  clusterName: localhost:8443\n  endpoints:\n    - lbEndpoints:\n        - endpoint:\n            address:\n              socketAddress:\n                address: 127.0.0.1\n                portValue: 8443\nname: localhost:8443\ntype: STATIC\n"
                }
              ]
            }
          },
          {
            type: 'ProxyTemplate',
            mesh: 'helloworld',
            name: 'pt-123',
            selectors: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              imports: [
                'default-proxy'
              ],
              resources: [
                {
                  name: 'raw-name',
                  version: 'raw-version',
                  resource: "'@type': type.googleapis.com/envoy.api.v2.Cluster\nconnectTimeout: 5s\nloadAssignment:\n  clusterName: localhost:8443\n  endpoints:\n    - lbEndpoints:\n        - endpoint:\n            address:\n              socketAddress:\n                address: 127.0.0.1\n                portValue: 8443\nname: localhost:8443\ntype: STATIC\n"
                }
              ]
            }
          }
        ]
      })
      .onGet('/meshes/default/proxytemplates').reply(200, {
        items: [
          {
            type: 'ProxyTemplate',
            mesh: 'default',
            name: 'pt-1',
            selectors: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              imports: [
                'default-proxy'
              ],
              resources: [
                {
                  name: 'raw-name',
                  version: 'raw-version',
                  resource: "'@type': type.googleapis.com/envoy.api.v2.Cluster\nconnectTimeout: 5s\nloadAssignment:\n  clusterName: localhost:8443\n  endpoints:\n    - lbEndpoints:\n        - endpoint:\n            address:\n              socketAddress:\n                address: 127.0.0.1\n                portValue: 8443\nname: localhost:8443\ntype: STATIC\n"
                }
              ]
            }
          }
        ]
      })
      .onGet('/meshes/helloworld/proxytemplates').reply(200, {
        items: [
          {
            type: 'ProxyTemplate',
            mesh: 'helloworld',
            name: 'pt-123',
            selectors: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              imports: [
                'default-proxy'
              ],
              resources: [
                {
                  name: 'raw-name',
                  version: 'raw-version',
                  resource: "'@type': type.googleapis.com/envoy.api.v2.Cluster\nconnectTimeout: 5s\nloadAssignment:\n  clusterName: localhost:8443\n  endpoints:\n    - lbEndpoints:\n        - endpoint:\n            address:\n              socketAddress:\n                address: 127.0.0.1\n                portValue: 8443\nname: localhost:8443\ntype: STATIC\n"
                }
              ]
            }
          }
        ]
      })
      .onGet('/meshes/default/proxytemplates/pt-1').reply(200, {
        type: 'ProxyTemplate',
        mesh: 'default',
        name: 'pt-1',
        selectors: [
          {
            match: {
              service: 'backend'
            }
          }
        ],
        conf: {
          imports: [
            'default-proxy'
          ],
          resources: [
            {
              name: 'raw-name',
              version: 'raw-version',
              resource: "'@type': type.googleapis.com/envoy.api.v2.Cluster\nconnectTimeout: 5s\nloadAssignment:\n  clusterName: localhost:8443\n  endpoints:\n    - lbEndpoints:\n        - endpoint:\n            address:\n              socketAddress:\n                address: 127.0.0.1\n                portValue: 8443\nname: localhost:8443\ntype: STATIC\n"
            }
          ]
        }
      })
      .onGet('/meshes/helloworld/proxytemplates/pt-123').reply(200, {
        type: 'ProxyTemplate',
        mesh: 'helloworld',
        name: 'pt-123',
        selectors: [
          {
            match: {
              service: 'backend'
            }
          }
        ],
        conf: {
          imports: [
            'default-proxy'
          ],
          resources: [
            {
              name: 'raw-name',
              version: 'raw-version',
              resource: "'@type': type.googleapis.com/envoy.api.v2.Cluster\nconnectTimeout: 5s\nloadAssignment:\n  clusterName: localhost:8443\n  endpoints:\n    - lbEndpoints:\n        - endpoint:\n            address:\n              socketAddress:\n                address: 127.0.0.1\n                portValue: 8443\nname: localhost:8443\ntype: STATIC\n"
            }
          ]
        }
      })
      .onGet('/traffic-logs').reply(200, {
        items: [
          {
            type: 'TrafficLog',
            mesh: 'default',
            name: 'tl-1',
            sources: [
              {
                match: {
                  service: 'web',
                  version: '1.0'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              backend: 'file'
            }
          },
          {
            type: 'TrafficLog',
            mesh: 'default',
            name: 'tl-123',
            sources: [
              {
                match: {
                  service: 'web',
                  version: '1.0'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              backend: 'file'
            }
          },
          {
            type: 'TrafficLog',
            mesh: 'helloworld',
            name: 'tl-alpha-tango',
            sources: [
              {
                match: {
                  service: 'web',
                  version: '1.0'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              backend: 'file'
            }
          },
          {
            type: 'TrafficLog',
            mesh: 'my-silly-mesh-name',
            name: 'tl-cat-dog-donut-12',
            sources: [
              {
                match: {
                  service: 'web',
                  version: '1.0'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            conf: {
              backend: 'file'
            }
          }
        ]
      })
      .onGet('/traffic-permissions').reply(200, {
        items: [
          {
            type: 'TrafficPermission',
            mesh: 'default',
            name: 'tp-1',
            sources: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'redis'
                }
              }
            ]
          },
          {
            type: 'TrafficPermission',
            mesh: 'default',
            name: 'tp-1234',
            sources: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'redis'
                }
              }
            ]
          },
          {
            type: 'TrafficPermission',
            mesh: 'default',
            name: 'tp-alpha-tango-donut',
            sources: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'redis'
                }
              }
            ]
          },
          {
            type: 'TrafficPermission',
            mesh: 'helloworld',
            name: 'tp-bravo-alpha-shiba',
            sources: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'redis'
                }
              }
            ]
          }
        ]
      })
      .onGet('/meshes/default/traffic-permissions').reply(200, {
        items: [
          {
            type: 'TrafficPermission',
            mesh: 'default',
            name: 'tp-1',
            sources: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'redis'
                }
              }
            ]
          },
          {
            type: 'TrafficPermission',
            mesh: 'default',
            name: 'tp-1234',
            sources: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'redis'
                }
              }
            ]
          },
          {
            type: 'TrafficPermission',
            mesh: 'default',
            name: 'tp-alpha-tango-donut',
            sources: [
              {
                match: {
                  service: 'backend'
                }
              }
            ],
            destinations: [
              {
                match: {
                  service: 'redis'
                }
              }
            ]
          }
        ]
      })
      .onAny().passThrough()
  }
}
