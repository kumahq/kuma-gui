export default class Mock {
  constructor (axios) {
    var MockAdapter = require('axios-mock-adapter')

    const mockDelay = 0

    this.mock = new MockAdapter(axios, { delayResponse: mockDelay })
    this.mock.injectMocks = () => {
      return this.mock
    }
  }

  setupPluginMocks () {
    this.mock
      .injectMocks() // additional mocks added from RestClient
      .onAny()
      .passThrough()
  }

  setupMockEndpoints () {
    console.warn(
      '%c ✨You are mocking api requests.',
      'background: gray; color: white; display: block; padding: 0.25rem;'
    )

    this.mock
      .onGet('/meshes')
      .reply(200, {
        total: 3,
        items: [
          {
            type: 'Mesh',
            name: 'default',
            creationTime: '2020-06-19T12:18:02.097986-04:00',
            modificationTime: '2020-06-19T12:18:02.097986-04:00'
          },
          {
            type: 'Mesh',
            name: 'mesh-01',
            creationTime: '2020-06-19T12:18:02.097986-04:00',
            modificationTime: '2020-06-19T12:18:02.097986-04:00',
            mtls: {
              enabledBackend: 'ca-1',
              backends: [
                {
                  name: 'ca-1',
                  type: 'provided',
                  dpCert: {
                    rotation: {
                      expiration: '1d'
                    }
                  },
                  conf: {
                    cert: {
                      secret: 'name-of-secret'
                    },
                    key: {
                      secret: 'name-of-secret'
                    }
                  }
                }
              ]
            }
          },
          {
            type: 'Mesh',
            name: 'kong-mania-12',
            creationTime: '2020-06-19T12:18:02.097986-04:00',
            modificationTime: '2020-06-19T12:18:02.097986-04:00'
          },
          {
            type: 'Mesh',
            name: 'hello-world',
            creationTime: '2020-06-19T12:18:02.097986-04:00',
            modificationTime: '2020-06-19T12:18:02.097986-04:00'
          }
        ],
        next: null
      })
      .onGet('/meshes/default')
      .reply(200, {
        name: 'default',
        type: 'Mesh',
        creationTime: '2020-06-19T12:18:02.097986-04:00',
        modificationTime: '2020-06-19T12:18:02.097986-04:00',
        mtls: {
          ca: {
            builtin: {}
          }
        }
      })
      .onGet('/meshes/mesh-01')
      .reply(200, {
        type: 'Mesh',
        name: 'mesh-01',
        creationTime: '2020-06-19T12:18:02.097986-04:00',
        modificationTime: '2020-06-19T12:18:02.097986-04:00',
        mtls: {
          enabledBackend: 'ca-1',
          backends: [
            {
              name: 'ca-1',
              type: 'provided',
              dpCert: {
                rotation: {
                  expiration: '1d'
                }
              },
              conf: {
                cert: {
                  secret: 'name-of-secret'
                },
                key: {
                  secret: 'name-of-secret'
                }
              }
            }
          ]
        }
      })
      .onGet('/meshes/kong-mania-12')
      .reply(200, {
        type: 'Mesh',
        name: 'kong-mania-12',
        creationTime: '2020-06-19T12:18:02.097986-04:00',
        modificationTime: '2020-06-19T12:18:02.097986-04:00',
        mtls: {
          ca: {
            builtin: {}
          }
        }
      })
      .onGet('/meshes/hello-world')
      .reply(200, {
        type: 'Mesh',
        name: 'hello-world',
        creationTime: '2020-06-19T12:18:02.097986-04:00',
        modificationTime: '2020-06-19T12:18:02.097986-04:00',
        mtls: {
          ca: {
            builtin: {}
          }
        }
      })
      .onGet('/dataplanes').reply(200, {
        total: 2,
        items: [
          {
            mesh: 'default',
            name: 'hello-world-foobar-002',
            networking: {},
            type: 'Dataplane'
          },
          {
            mesh: 'default',
            name: 'test-dp-02',
            networking: {},
            type: 'Dataplane'
          }
        ],
        next: null
      })
      .onGet('/meshes/default/dataplanes')
      .reply(200, {
        total: 2,
        items: [
          {
            mesh: 'default',
            name: 'hello-world-foobar-002',
            type: 'Dataplane',
            networking: {
              address: '10.0.0.1',
              gateway: {
                tags: {
                  service: 'kong'
                }
              },
              outbound: {
                port: '33033',
                service: 'backend'
              }
            }
          },
          {
            mesh: 'default',
            name: 'test-dp-02',
            type: 'Dataplane',
            networking: {
              address: '192.168.64.8',
              inbound: [
                {
                  port: 10001
                }
              ],
              ingress: [
                {
                  service: 'frontend.kuma-demo.svc:8080',
                  tags: {
                    app: 'kuma-demo-frontend',
                    env: 'prod',
                    'pod-template-hash': '69c9fd4bd',
                    protocol: 'http',
                    version: 'v8'
                  }
                },
                {
                  service: 'backend.kuma-demo.svc:3001',
                  tags: {
                    app: 'kuma-demo-backend',
                    env: 'prod',
                    'pod-template-hash': 'd7cb6b576',
                    protocol: 'http',
                    version: 'v0'
                  }
                },
                {
                  service: 'postgres.kuma-demo.svc:5432',
                  tags: {
                    app: 'postgres',
                    'pod-template-hash': '65df766577',
                    protocol: 'tcp'
                  }
                },
                {
                  service: 'redis.kuma-demo.svc:6379',
                  tags: {
                    app: 'redis',
                    'pod-template-hash': '78ff699f7',
                    protocol: 'tcp',
                    role: 'master',
                    tier: 'backend'
                  }
                }
              ]
            }
          }
        ],
        next: null
      })
      .onGet('/meshes/default/dataplanes/test-dp-02')
      .reply(200, {
        type: 'Dataplane',
        mesh: 'default',
        name: 'test-dp-02',
        networking: {
          address: '192.168.64.8',
          inbound: [
            {
              port: 10001
            }
          ],
          ingress: [
            {
              service: 'frontend.kuma-demo.svc:8080',
              tags: {
                app: 'kuma-demo-frontend',
                env: 'prod',
                'pod-template-hash': '69c9fd4bd',
                protocol: 'http',
                version: 'v8'
              }
            },
            {
              service: 'backend.kuma-demo.svc:3001',
              tags: {
                app: 'kuma-demo-backend',
                env: 'prod',
                'pod-template-hash': 'd7cb6b576',
                protocol: 'http',
                version: 'v0'
              }
            },
            {
              service: 'postgres.kuma-demo.svc:5432',
              tags: {
                app: 'postgres',
                'pod-template-hash': '65df766577',
                protocol: 'tcp'
              }
            },
            {
              service: 'redis.kuma-demo.svc:6379',
              tags: {
                app: 'redis',
                'pod-template-hash': '78ff699f7',
                protocol: 'tcp',
                role: 'master',
                tier: 'backend'
              }
            }
          ]
        }
      })
      .onGet('/meshes/default/dataplanes/ingress-dp-test-123')
      .reply(200, {
        type: 'Dataplane',
        mesh: 'default',
        name: 'ingress-dp-test-123',
        creationTime: '2020-06-02T09:33:09.208372-04:00',
        modificationTime: '2020-06-02T09:33:09.208372-04:00',
        networking: {
          address: '192.168.64.8',
          inbound: [
            {
              port: 10001
            }
          ],
          ingress: [
            {
              service: 'frontend.kuma-demo.svc:8080',
              tags: {
                app: 'kuma-demo-frontend',
                env: 'prod',
                'pod-template-hash': '69c9fd4bd',
                protocol: 'http',
                version: 'v8'
              }
            },
            {
              service: 'backend.kuma-demo.svc:3001',
              tags: {
                app: 'kuma-demo-backend',
                env: 'prod',
                'pod-template-hash': 'd7cb6b576',
                protocol: 'http',
                version: 'v0'
              }
            },
            {
              service: 'postgres.kuma-demo.svc:5432',
              tags: {
                app: 'postgres',
                'pod-template-hash': '65df766577',
                protocol: 'tcp'
              }
            },
            {
              service: 'redis.kuma-demo.svc:6379',
              tags: {
                app: 'redis',
                'pod-template-hash': '78ff699f7',
                protocol: 'tcp',
                role: 'master',
                tier: 'backend'
              }
            }
          ]
        }
      })
      .onGet('/dataplanes+insights', { params: { ingress: true } }).reply(200, {
        total: 2,
        items: [
          {
            type: 'DataplaneOverview',
            mesh: 'default',
            name: 'ingress-dp-test-123',
            creationTime: '2020-06-29T09:27:46.05334-04:00',
            modificationTime: '2020-06-29T09:27:46.05334-04:00',
            dataplane: {
              networking: {
                address: '192.168.64.8',
                inbound: [
                  {
                    port: 10001
                  }
                ],
                ingress: [
                  {
                    service: 'frontend.kuma-demo.svc:8080',
                    tags: {
                      app: 'kuma-demo-frontend',
                      env: 'prod',
                      'pod-template-hash': '69c9fd4bd',
                      protocol: 'http',
                      version: 'v8'
                    }
                  },
                  {
                    service: 'backend.kuma-demo.svc:3001',
                    tags: {
                      app: 'kuma-demo-backend',
                      env: 'prod',
                      'pod-template-hash': 'd7cb6b576',
                      protocol: 'http',
                      version: 'v0'
                    }
                  },
                  {
                    service: 'postgres.kuma-demo.svc:5432',
                    tags: {
                      app: 'postgres',
                      'pod-template-hash': '65df766577',
                      protocol: 'tcp'
                    }
                  },
                  {
                    service: 'redis.kuma-demo.svc:6379',
                    tags: {
                      app: 'redis',
                      'pod-template-hash': '78ff699f7',
                      protocol: 'tcp',
                      role: 'master',
                      tier: 'backend'
                    }
                  }
                ]
              }
            }
          }
        ],
        next: null
      })
      .onGet('/meshes/default/dataplanes+insights/ingress-dp-test-123')
      .reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'ingress-dp-test-123',
        dataplane: {
          networking: {
            address: '192.168.64.8',
            inbound: [
              {
                port: 10001
              }
            ],
            ingress: [
              {
                service: 'frontend.kuma-demo.svc:8080',
                tags: {
                  app: 'kuma-demo-frontend',
                  env: 'prod',
                  'pod-template-hash': '69c9fd4bd',
                  protocol: 'http',
                  version: 'v8'
                }
              },
              {
                service: 'backend.kuma-demo.svc:3001',
                tags: {
                  app: 'kuma-demo-backend',
                  env: 'prod',
                  'pod-template-hash': 'd7cb6b576',
                  protocol: 'http',
                  version: 'v0'
                }
              },
              {
                service: 'postgres.kuma-demo.svc:5432',
                tags: {
                  app: 'postgres',
                  'pod-template-hash': '65df766577',
                  protocol: 'tcp'
                }
              },
              {
                service: 'redis.kuma-demo.svc:6379',
                tags: {
                  app: 'redis',
                  'pod-template-hash': '78ff699f7',
                  protocol: 'tcp',
                  role: 'master',
                  tier: 'backend'
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
          ]
        }
      })
      .onGet('/meshes/default/dataplanes/hello-world-foobar-002')
      .reply(200, {
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
                env: 'dev',
                service: 'kuma-example-backend',
                tag01: 'value01',
                reallyLongTagLabelHere: 'a-really-long-tag-value-here'
              }
            }
          ]
        }
      })
      .onGet('/meshes/default/dataplanes+insights/hello-world-foobar-002')
      .reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'hello-world-foobar-002',
        dataplane: {
          networking: {
            address: '10.0.0.1',
            inbound: [
              {
                port: 10000,
                servicePort: 9000,
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
          mTLS: {
            certificateExpirationTime: '2020-05-11T16:53:55Z',
            lastCertificateRegeneration: '2020-05-11T16:53:40.862241Z',
            certificateRegenerations: 2
          }
        }
      })
      .onGet('/meshes/default/traffic-traces')
      .reply(200, {
        total: 2,
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
          }
        ]
      })
      .onGet('/meshes/default/traffic-traces/tt-1')
      .reply(200, {
        type: 'TrafficTrace',
        mesh: 'mesh-1',
        name: 'tt-1',
        creationTime: '2020-05-12T12:31:45.606217+02:00',
        modificationTime: '2020-05-12T12:31:45.606217+02:00',
        conf: {
          backend: 'my-zipkin'
        },
        selectors: [
          {
            match: {
              service: '*'
            }
          }
        ]
      })
      .onGet('/meshes/default/traffic-traces/traffic-trace-02')
      .reply(200, {
        type: 'TrafficTrace',
        mesh: 'mesh-1',
        name: 'traffic-trace-02',
        creationTime: '2020-05-12T12:31:45.606217+02:00',
        modificationTime: '2020-05-12T12:31:45.606217+02:00',
        conf: {
          backend: 'my-zipkin'
        },
        selectors: [
          {
            match: {
              service: '*'
            }
          }
        ]
      })
      .onGet('/traffic-traces')
      .reply(200, {
        total: 5,
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
      .onGet('/meshes/default/health-checks')
      .reply(200, {
        total: 7,
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
      .onGet('/meshes/default/health-checks/web-to-backend')
      .reply(200, {
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
      .onGet('/meshes/default/health-checks/web-to-banana')
      .reply(200, {
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
      .onGet('/meshes/default/health-checks/hello-health-check')
      .reply(200, {
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
      .onGet('/meshes/default/health-checks/testing-health-checks')
      .reply(200, {
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
      .onGet('/meshes/default/health-checks/health-check-0023')
      .reply(200, {
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
      .onGet('/meshes/default/health-checks/health-check-12345')
      .reply(200, {
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
      .onGet('/meshes/default/health-checks/foo-bar-baz-123')
      .reply(200, {
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
      .onGet('/health-checks')
      .reply(200, {
        total: 7,
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
      .onGet('/meshes/default/fault-injections')
      .reply(200, {
        total: 2,
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
      .onGet('/meshes/default/fault-injections/web-to-backend.kuma-system')
      .reply(200, {
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
      .onGet('/meshes/default/fault-injections/fi1.kuma-system')
      .reply(200, {
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
      .onGet('/fault-injections')
      .reply(200, {
        total: 2,
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
      .onGet('/proxytemplates')
      .reply(200, {
        total: 2,
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
              imports: ['default-proxy'],
              resources: [
                {
                  name: 'raw-name',
                  version: 'raw-version',
                  resource:
                    "'@type': type.googleapis.com/envoy.api.v2.Cluster\nconnectTimeout: 5s\nloadAssignment:\n  clusterName: localhost:8443\n  endpoints:\n    - lbEndpoints:\n        - endpoint:\n            address:\n              socketAddress:\n                address: 127.0.0.1\n                portValue: 8443\nname: localhost:8443\ntype: STATIC\n"
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
              imports: ['default-proxy'],
              resources: [
                {
                  name: 'raw-name',
                  version: 'raw-version',
                  resource:
                    "'@type': type.googleapis.com/envoy.api.v2.Cluster\nconnectTimeout: 5s\nloadAssignment:\n  clusterName: localhost:8443\n  endpoints:\n    - lbEndpoints:\n        - endpoint:\n            address:\n              socketAddress:\n                address: 127.0.0.1\n                portValue: 8443\nname: localhost:8443\ntype: STATIC\n"
                }
              ]
            }
          }
        ]
      })
      .onGet('/meshes/default/proxytemplates')
      .reply(200, {
        total: 1,
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
              imports: ['default-proxy'],
              resources: [
                {
                  name: 'raw-name',
                  version: 'raw-version',
                  resource:
                    "'@type': type.googleapis.com/envoy.api.v2.Cluster\nconnectTimeout: 5s\nloadAssignment:\n  clusterName: localhost:8443\n  endpoints:\n    - lbEndpoints:\n        - endpoint:\n            address:\n              socketAddress:\n                address: 127.0.0.1\n                portValue: 8443\nname: localhost:8443\ntype: STATIC\n"
                }
              ]
            }
          }
        ]
      })
      .onGet('/meshes/helloworld/proxytemplates')
      .reply(200, {
        total: 1,
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
              imports: ['default-proxy'],
              resources: [
                {
                  name: 'raw-name',
                  version: 'raw-version',
                  resource:
                    "'@type': type.googleapis.com/envoy.api.v2.Cluster\nconnectTimeout: 5s\nloadAssignment:\n  clusterName: localhost:8443\n  endpoints:\n    - lbEndpoints:\n        - endpoint:\n            address:\n              socketAddress:\n                address: 127.0.0.1\n                portValue: 8443\nname: localhost:8443\ntype: STATIC\n"
                }
              ]
            }
          }
        ]
      })
      .onGet('/meshes/default/proxytemplates/pt-1')
      .reply(200, {
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
          imports: ['default-proxy'],
          resources: [
            {
              name: 'raw-name',
              version: 'raw-version',
              resource:
                "'@type': type.googleapis.com/envoy.api.v2.Cluster\nconnectTimeout: 5s\nloadAssignment:\n  clusterName: localhost:8443\n  endpoints:\n    - lbEndpoints:\n        - endpoint:\n            address:\n              socketAddress:\n                address: 127.0.0.1\n                portValue: 8443\nname: localhost:8443\ntype: STATIC\n"
            }
          ]
        }
      })
      .onGet('/meshes/helloworld/proxytemplates/pt-123')
      .reply(200, {
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
          imports: ['default-proxy'],
          resources: [
            {
              name: 'raw-name',
              version: 'raw-version',
              resource:
                "'@type': type.googleapis.com/envoy.api.v2.Cluster\nconnectTimeout: 5s\nloadAssignment:\n  clusterName: localhost:8443\n  endpoints:\n    - lbEndpoints:\n        - endpoint:\n            address:\n              socketAddress:\n                address: 127.0.0.1\n                portValue: 8443\nname: localhost:8443\ntype: STATIC\n"
            }
          ]
        }
      })
      .onGet('/meshes/default/traffic-logs')
      .reply(200, {
        total: 2,
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
          }
        ]
      })
      .onGet('/meshes/default/traffic-logs/tl-1')
      .reply(200, {
        type: 'TrafficLog',
        mesh: 'mesh-1',
        name: 'tl-1',
        creationTime: '2020-05-12T12:31:45.606217+02:00',
        modificationTime: '2020-05-12T12:31:45.606217+02:00',
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
      })
      .onGet('/meshes/default/traffic-logs/tl-123')
      .reply(200, {
        type: 'TrafficLog',
        mesh: 'mesh-1',
        name: 'tl-123',
        creationTime: '2020-05-12T12:31:45.606217+02:00',
        modificationTime: '2020-05-12T12:31:45.606217+02:00',
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
      })
      .onGet('/traffic-permissions')
      .reply(200, {
        total: 3,
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
      .onGet('/meshes/mesh-01/traffic-permissions')
      .reply(200, {
        total: 3,
        items: [
          {
            type: 'TrafficPermission',
            mesh: 'mesh-01',
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
            mesh: 'mesh-01',
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
            mesh: 'mesh-01',
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
      .onGet('/meshes/mesh-01/traffic-permissions/tp-1')
      .reply(200, {
        type: 'TrafficPermission',
        mesh: 'mesh-1',
        name: 'tp-1',
        creationTime: '2020-05-12T12:31:45.606217+02:00',
        modificationTime: '2020-05-12T12:31:45.606217+02:00',
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
      })
      .onGet('/meshes/mesh-01/traffic-permissions/tp-1234')
      .reply(200, {
        type: 'TrafficPermission',
        mesh: 'mesh-1',
        name: 'tp-1234',
        creationTime: '2020-05-12T12:31:45.606217+02:00',
        modificationTime: '2020-05-12T12:31:45.606217+02:00',
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
      })
      .onGet('/meshes/mesh-01/traffic-permissions/tp-alpha-tango-donut')
      .reply(200, {
        type: 'TrafficPermission',
        mesh: 'mesh-1',
        name: 'tp-alpha-tango-donut',
        creationTime: '2020-05-12T12:31:45.606217+02:00',
        modificationTime: '2020-05-12T12:31:45.606217+02:00',
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
      })
      .onGet('/meshes/default/circuit-breakers')
      .reply(200, {
        total: 2,
        items: [
          {
            type: 'CircuitBreaker',
            mesh: 'default',
            name: 'cb1',
            creationTime: '2020-06-02T00:24:05.038029+07:00',
            modificationTime: '2020-06-02T00:24:05.038029+07:00',
            sources: [
              {
                match: {
                  region: 'us',
                  service: 'frontend'
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
              interval: '1s',
              baseEjectionTime: '30s',
              maxEjectionPercent: 20,
              detectors: {
                totalErrors: {
                  consecutive: 20
                },
                gatewayErrors: {
                  consecutive: 10
                },
                localErrors: {
                  consecutive: 7
                },
                standardDeviation: {
                  requestVolume: 10,
                  minimumHosts: 5,
                  factor: 1.9
                },
                failure: {
                  requestVolume: 10,
                  minimumHosts: 5,
                  threshold: 85
                }
              }
            }
          },
          {
            type: 'CircuitBreaker',
            mesh: 'default',
            name: 'cb2',
            creationTime: '2020-06-02T00:24:48.48207+07:00',
            modificationTime: '2020-06-02T00:24:48.48207+07:00',
            sources: [
              {
                match: {
                  region: 'eu',
                  service: 'frontend'
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
              interval: '30s',
              baseEjectionTime: '130s',
              maxEjectionPercent: 20,
              detectors: {
                totalErrors: {
                  consecutive: 20
                },
                gatewayErrors: {
                  consecutive: 10
                },
                localErrors: {
                  consecutive: 7
                },
                standardDeviation: {
                  requestVolume: 10,
                  minimumHosts: 5,
                  factor: 1.9
                },
                failure: {
                  requestVolume: 10,
                  minimumHosts: 5,
                  threshold: 85
                }
              }
            }
          }
        ],
        next: null
      })
      .onGet('/circuit-breakers')
      .reply(200, {
        total: 2,
        items: [
          {
            type: 'CircuitBreaker',
            mesh: 'default',
            name: 'cb1',
            creationTime: '2020-06-02T00:24:05.038029+07:00',
            modificationTime: '2020-06-02T00:24:05.038029+07:00',
            sources: [
              {
                match: {
                  region: 'us',
                  service: 'frontend'
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
              interval: '1s',
              baseEjectionTime: '30s',
              maxEjectionPercent: 20,
              detectors: {
                totalErrors: {
                  consecutive: 20
                },
                gatewayErrors: {
                  consecutive: 10
                },
                localErrors: {
                  consecutive: 7
                },
                standardDeviation: {
                  requestVolume: 10,
                  minimumHosts: 5,
                  factor: 1.9
                },
                failure: {
                  requestVolume: 10,
                  minimumHosts: 5,
                  threshold: 85
                }
              }
            }
          },
          {
            type: 'CircuitBreaker',
            mesh: 'default',
            name: 'cb2',
            creationTime: '2020-06-02T00:24:48.48207+07:00',
            modificationTime: '2020-06-02T00:24:48.48207+07:00',
            sources: [
              {
                match: {
                  region: 'eu',
                  service: 'frontend'
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
              interval: '30s',
              baseEjectionTime: '130s',
              maxEjectionPercent: 20,
              detectors: {
                totalErrors: {
                  consecutive: 20
                },
                gatewayErrors: {
                  consecutive: 10
                },
                localErrors: {
                  consecutive: 7
                },
                standardDeviation: {
                  requestVolume: 10,
                  minimumHosts: 5,
                  factor: 1.9
                },
                failure: {
                  requestVolume: 10,
                  minimumHosts: 5,
                  threshold: 85
                }
              }
            }
          }
        ],
        next: null
      })
      .onGet('/meshes/alpha-tango-mesh/circuit-breakers')
      .reply(200, {
        total: 0,
        items: [],
        next: null
      })
      .onGet('/meshes/default/circuit-breakers/cb1')
      .reply(200, {
        type: 'CircuitBreaker',
        mesh: 'default',
        name: 'cb1',
        creationTime: '2020-06-02T00:24:05.038029+07:00',
        modificationTime: '2020-06-02T00:24:05.038029+07:00',
        sources: [
          {
            match: {
              region: 'us',
              service: 'frontend'
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
          interval: '1s',
          baseEjectionTime: '30s',
          maxEjectionPercent: 20,
          detectors: {
            totalErrors: {
              consecutive: 20
            },
            gatewayErrors: {
              consecutive: 10
            },
            localErrors: {
              consecutive: 7
            },
            standardDeviation: {
              requestVolume: 10,
              minimumHosts: 5,
              factor: 1.9
            },
            failure: {
              requestVolume: 10,
              minimumHosts: 5,
              threshold: 85
            }
          }
        }
      })
      .onGet('/meshes/default/circuit-breakers/cb2')
      .reply(200, {
        type: 'CircuitBreaker',
        mesh: 'default',
        name: 'cb2',
        creationTime: '2020-06-02T00:24:05.038029+07:00',
        modificationTime: '2020-06-02T00:24:05.038029+07:00',
        sources: [
          {
            match: {
              region: 'us',
              service: 'frontend'
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
          interval: '1s',
          baseEjectionTime: '30s',
          maxEjectionPercent: 20,
          detectors: {
            totalErrors: {
              consecutive: 20
            },
            gatewayErrors: {
              consecutive: 10
            },
            localErrors: {
              consecutive: 7
            },
            standardDeviation: {
              requestVolume: 10,
              minimumHosts: 5,
              factor: 1.9
            },
            failure: {
              requestVolume: 10,
              minimumHosts: 5,
              threshold: 85
            }
          }
        }
      })
      // Remote CPs
      .onGet('/status/clusters')
      .reply(200, [
        {
          active: false,
          name: 'http://127.0.0.1:5681',
          url: 'http://172.18.0.1:5681'
        },
        {
          active: true,
          name: 'http://172.18.0.2:5681',
          url: 'http://172.18.0.2:5681'
        },
        {
          active: false,
          name: 'http://172.18.0.3:5681',
          url: 'http://172.18.0.3:5681'
        }
      ])
      // config
      .onGet('/config')
      .reply(200, {
        mode: 'global'
      })
      .onAny()
      .passThrough()
  }
}
