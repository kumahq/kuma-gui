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

  /**
   * Mock notes
   *
   * Because of how the app and endpoints are setup, if you decide to enable
   * mocks, you will need to create matching detail endpoints for any data you
   * create.
   *
   * For example, if you have a list of dataplanes from the `/meshes/default/dataplanes/`
   * endpoint, you will have to make sure there is matching data at the
   * `/meshes/default/dataplanes+insights/` endpoint for each mocked entity.
   * Otherwise you will encounter errors because of a mismatch in mocked data
   * when each table view tries to the extra data needed.
   *
   * For this reason, mocking is currently disabled.
   */

  setupMockEndpoints () {
    console.warn('%c ✨You are mocking api requests.',
      'background: gray; color: white; display: block; padding: 0.25rem;')

    this.mock
      .onGet('/meshes').reply(200, {
        items: [
          {
            mtls: {
              ca: {
                builtin: {}
              }
            },
            name: 'default',
            type: 'Mesh'
          },
          {
            mtls: {
              ca: {
                builtin: {}
              }
            },
            name: 'mesh-01',
            type: 'Mesh'
          },
          {
            mtls: {
              ca: {
                builtin: {}
              }
            },
            name: 'kong-mania-12',
            type: 'Mesh'
          },
          {
            mtls: {
              ca: {
                builtin: {}
              }
            },
            name: 'hello-world',
            type: 'Mesh'
          }
        ]
      })
      .onGet('/meshes/default').reply(200, {
        mtls: {
          ca: {
            builtin: {}
          }
        },
        name: 'default',
        type: 'Mesh'
      })
      .onGet('/meshes/mesh-01').reply(200, {
        mtls: {
          ca: {
            builtin: {}
          }
        },
        name: 'mesh-01',
        type: 'Mesh'
      })
      .onGet('/meshes/kong-mania-12').reply(200, {
        mtls: {
          ca: {
            builtin: {}
          }
        },
        name: 'kong-mania-12',
        type: 'Mesh'
      })
      .onGet('/meshes/hello-world').reply(200, {
        mtls: {
          ca: {
            builtin: {}
          }
        },
        name: 'hello-world',
        type: 'Mesh'
      })
      .onGet('/meshes/default/dataplanes').reply(200, {
        items: [
          {
            mesh: 'default',
            name: 'kuma-example-app',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.4:8000:8000',
                  tags: {
                    service: 'kuma-example-app',
                    tag02: 'value02',
                    tag03: 'value03',
                    tag04: 'value04',
                    tag05: 'value05',
                    tag06: 'value06',
                    tag07: 'value07',
                    tag08: 'value08'
                  }
                }
              ]
            },
            type: 'Dataplane'
          },
          {
            mesh: 'default',
            name: 'kuma-example-client',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.7:3000:3000',
                  tags: {
                    service: 'kuma-example-client',
                    tag02: 'value02',
                    tag03: 'value03',
                    tag04: 'value04',
                    tag05: 'value05'
                  }
                }
              ],
              outbound: [
                {
                  interface: ':4000',
                  service: 'kuma-example-app'
                }
              ]
            },
            type: 'Dataplane'
          },
          {
            mesh: 'default',
            name: 'kuma-example-web',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.6:6060:6060',
                  tags: {
                    env: 'prod',
                    service: 'kuma-example-web',
                    version: 'v8',
                    tag02: 'value02',
                    tag03: 'value03',
                    tag04: 'value04'
                  }
                }
              ],
              outbound: [
                {
                  interface: ':5000',
                  service: 'kuma-example-backend'
                }
              ]
            },
            type: 'Dataplane'
          },
          {
            mesh: 'default',
            name: 'kuma-example-backend-v1',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.3:7070:7070',
                  tags: {
                    env: 'prod',
                    service: 'kuma-example-backend',
                    version: 'v1'
                  }
                }
              ]
            },
            type: 'Dataplane'
          },
          {
            mesh: 'default',
            name: 'kuma-example-backend-v2',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.5:7070:7070',
                  tags: {
                    env: 'intg',
                    service: 'kuma-example-backend',
                    version: 'v2'
                  }
                }
              ]
            },
            type: 'Dataplane'
          },
          {
            mesh: 'default',
            name: 'another-example-dataplane',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.5:7070:7070',
                  tags: {
                    env: 'intg',
                    service: 'kuma-example-backend',
                    version: 'v2'
                  }
                }
              ]
            },
            type: 'Dataplane'
          },
          {
            mesh: 'default',
            name: 'example-dp-22',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.5:7070:7070',
                  tags: {
                    env: 'intg',
                    service: 'kuma-example-backend',
                    version: 'v2'
                  }
                }
              ]
            },
            type: 'Dataplane'
          },
          {
            mesh: 'default',
            name: 'dataplanes-are-neat',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.5:7070:7070',
                  tags: {
                    env: 'intg',
                    service: 'kuma-example-backend',
                    version: 'v2'
                  }
                }
              ]
            },
            type: 'Dataplane'
          },
          {
            mesh: 'default',
            name: 'foobar-baz-2000',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.5:7070:7070',
                  tags: {
                    env: 'intg',
                    service: 'kuma-example-backend',
                    version: 'v2'
                  }
                }
              ]
            },
            type: 'Dataplane'
          },
          {
            mesh: 'default',
            name: 'dp-testing-1234',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.5:7070:7070',
                  tags: {
                    env: 'intg',
                    service: 'kuma-example-backend',
                    version: 'v2'
                  }
                }
              ]
            },
            type: 'Dataplane'
          },
          {
            mesh: 'default',
            name: 'hello-world-1234',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.5:7070:7070',
                  tags: {
                    env: 'intg',
                    service: 'kuma-example-backend',
                    version: 'v2'
                  }
                }
              ]
            },
            type: 'Dataplane'
          },
          {
            mesh: 'default',
            name: 'testing-the-gui-dp',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.5:7070:7070',
                  tags: {
                    env: 'intg',
                    service: 'kuma-example-backend',
                    version: 'v2'
                  }
                }
              ]
            },
            type: 'Dataplane'
          },
          {
            mesh: 'default',
            name: 'testing-the-gui-dp-1',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.5:7070:7070',
                  tags: {
                    env: 'intg',
                    service: 'kuma-example-backend',
                    version: 'v2'
                  }
                }
              ]
            },
            type: 'Dataplane'
          },
          {
            mesh: 'default',
            name: 'testing-the-gui-dp-2',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.5:7070:7070',
                  tags: {
                    env: 'intg',
                    service: 'kuma-example-backend',
                    version: 'v2'
                  }
                }
              ]
            },
            type: 'Dataplane'
          }
        ]
      })
      .onGet('/meshes/default/dataplanes+insights/kuma-example-app').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'kuma-example-app',
        dataplane: {
          networking: {
            address: '172.21.0.8',
            inbound: [
              {
                port: 8000,
                servicePort: 8000,
                tags: {
                  protocol: 'http',
                  service: 'kuma-example-app'
                }
              }
            ]
          }
        },
        dataplaneInsight: {}
      })
      .onGet('/meshes/default/dataplanes+insights/kuma-example-app').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'kuma-example-app',
        dataplane: {
          networking: {
            address: '172.21.0.8',
            inbound: [
              {
                port: 8000,
                servicePort: 8000,
                tags: {
                  protocol: 'http',
                  service: 'kuma-example-app'
                }
              }
            ]
          }
        },
        dataplaneInsight: {}
      })
      .onGet('/meshes/default/dataplanes+insights/kuma-example-backend-v1').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'kuma-example-backend-v1',
        dataplane: {
          networking: {
            address: '172.21.0.5',
            inbound: [
              {
                port: 7070,
                servicePort: 7070,
                tags: {
                  env: 'prod',
                  service: 'kuma-example-backend',
                  version: 'v1'
                }
              }
            ]
          }
        },
        dataplaneInsight: {}
      })
      .onGet('/meshes/default/dataplanes+insights/kuma-example-backend-v2').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'kuma-example-backend-v2',
        dataplane: {
          networking: {
            address: '172.21.0.5',
            inbound: [
              {
                port: 7070,
                servicePort: 7070,
                tags: {
                  env: 'prod',
                  service: 'kuma-example-backend',
                  version: 'v1',
                  tag00: 'value-00',
                  tag01: 'value-01',
                  tag02: 'value-02',
                  tag03: 'value-03'
                }
              }
            ]
          }
        },
        dataplaneInsight: {}
      })
      .onGet('/meshes/default/dataplanes+insights/kuma-example-client').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'kuma-example-client',
        dataplane: {
          networking: {
            address: '172.21.0.5',
            inbound: [
              {
                port: 7070,
                servicePort: 7070,
                tags: {
                  env: 'something',
                  service: 'kuma-example-backend'
                }
              }
            ]
          }
        },
        dataplaneInsight: {}
      })
      .onGet('/meshes/default/dataplanes+insights/kuma-example-web').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'kuma-example-web',
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
        dataplaneInsight: {}
      })
      .onGet('/meshes/default/dataplanes+insights/another-example-dataplane').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'another-example-dataplane',
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
        dataplaneInsight: {}
      })
      .onGet('/meshes/default/dataplanes+insights/another-example-dataplane').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'another-example-dataplane',
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
        dataplaneInsight: {}
      })
      .onGet('/meshes/default/dataplanes+insights/example-dp-22').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'example-dp-22',
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
        dataplaneInsight: {}
      })
      .onGet('/meshes/default/dataplanes+insights/dataplanes-are-neat').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'dataplanes-are-neat',
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
        dataplaneInsight: {}
      })
      .onGet('/meshes/default/dataplanes+insights/foobar-baz-2000').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'foobar-baz-2000',
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
        dataplaneInsight: {}
      })
      .onGet('/meshes/default/dataplanes+insights/dp-testing-1234').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'dp-testing-1234',
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
        dataplaneInsight: {}
      })
      .onGet('/meshes/default/dataplanes+insights/hello-world-1234').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'hello-world-1234',
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
        dataplaneInsight: {}
      })
      .onGet('/meshes/default/dataplanes+insights/testing-the-gui-dp').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'testing-the-gui-dp',
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
        dataplaneInsight: {}
      })
      .onGet('/meshes/default/dataplanes+insights/testing-the-gui-dp-1').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'testing-the-gui-dp',
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
        dataplaneInsight: {}
      })
      .onGet('/meshes/default/dataplanes+insights/testing-the-gui-dp-2').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'default',
        name: 'testing-the-gui-dp',
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
        dataplaneInsight: {}
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
      .onAny().passThrough()
  }
}
