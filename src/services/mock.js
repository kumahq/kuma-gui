export default class Mock {
  constructor (axios) {
    var MockAdapter = require('axios-mock-adapter')

    this.mock = new MockAdapter(axios, { delayResponse: 1000 })
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
                    service: 'kuma-example-app'
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
                    service: 'kuma-example-client'
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
      .onAny().passThrough()
  }
}
