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
            mesh: 'mesh-01',
            name: 'hello-world-foobar-002',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.4:8000:8000',
                  tags: {
                    service: 'hello-world-foobar-002',
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
            mesh: 'helloworld',
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
          }
        ]
      })
      .onGet('/meshes/mesh-01/dataplanes').reply(200, {
        items: [
          {
            mesh: 'mesh-01',
            name: 'hello-world-foobar-002',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.4:8000:8000',
                  tags: {
                    service: 'hello-world-foobar-002',
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
            mesh: 'mesh-01',
            name: 'kuma-test-run-001',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.7:3000:3000',
                  tags: {
                    service: 'kuma-test-run-001',
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
            mesh: 'mesh-01',
            name: 'some-really-cool-dp',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.6:6060:6060',
                  tags: {
                    env: 'prod',
                    service: 'some-really-cool-dp',
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
          }
        ]
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
                    version: 'v8'
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
          }
        ]
      })
      .onGet('/meshes/kong-mania-12/dataplanes').reply(200, {
        items: [
          {
            mesh: 'kong-mania-12',
            name: 'hello-world-bazfoo-123',
            networking: {
              inbound: [
                {
                  interface: '172.21.0.4:8000:8000',
                  tags: {
                    service: 'hello-world-bazfoo-123',
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
          }
        ]
      })
      .onGet('/meshes/mesh-01/dataplanes+insights/kuma-example-app').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'mesh-01',
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
        dataplaneInsight: {
          subscriptions: [
            {
              id: '426fe0d8-f667-11e9-b081-acde48001122',
              controlPlaneInstanceId: '06070748-f667-11e9-b081-acde48001122',
              connectTime: '2019-10-24T14:04:56.820350Z',
              disconnectTime: '2019-12-24T14:04:56.820350Z',
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
      .onGet('/meshes/mesh-01/dataplanes+insights/kuma-test-run-001').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'mesh-01',
        name: 'kuma-test-run-001',
        dataplane: {
          networking: {
            address: '172.21.0.8',
            inbound: [
              {
                port: 8000,
                servicePort: 8000,
                tags: {
                  protocol: 'http',
                  service: 'kuma-test-run-001'
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
      .onGet('/meshes/mesh-01/dataplanes+insights/some-really-cool-dp').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'mesh-01',
        name: 'some-really-cool-dp',
        dataplane: {
          networking: {
            address: '172.21.0.8',
            inbound: [
              {
                port: 8000,
                servicePort: 8000,
                tags: {
                  protocol: 'http',
                  service: 'some-really-cool-dp'
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
              disconnectTime: '2019-12-24T14:04:56.820350Z',
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
                  env: 'prod',
                  service: 'kuma-example-web',
                  version: 'v8'
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
        dataplaneInsight: {
          subscriptions: [
            {
              id: '426fe0d8-f667-11e9-b081-acde48001122',
              controlPlaneInstanceId: '06070748-f667-11e9-b081-acde48001122',
              connectTime: '2019-10-24T14:04:56.820350Z',
              disconnectTime: '2019-12-24T14:04:56.820350Z',
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
      .onGet('/meshes/kong-mania-12/dataplanes+insights/hello-world-bazfoo-123').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'kong-mania-12',
        name: 'hello-world-bazfoo-123',
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
          ]
        }
      })
      .onGet('/meshes/mesh-01/dataplanes+insights/hello-world-foobar-002').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'mesh-01',
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
          ]
        }
      })
      .onGet('/meshes/helloworld/dataplanes+insights/kuma-example-app').reply(200, {
        type: 'DataplaneOverview',
        mesh: 'helloworld',
        name: 'kuma-example-app',
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
          ]
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
