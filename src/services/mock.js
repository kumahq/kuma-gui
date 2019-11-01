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

  setupMockEndpoints () {
    console.warn('%c ✨You are mocking api requests.',
      'background: gray; color: white; display: block; padding: 0.25rem;')

    this.mock
      .onGet('/meshes').reply(200, {
        data: [
          {
            name: 'mesh-1',
            type: 'Mesh',
            mtls: {
              ca: {
                builtin: {}
              },
              enabled: true
            },
            tracing: {},
            logging: {
              backends: [
                {
                  name: 'file-tmp',
                  format: '{ "destination": "%KUMA_DESTINATION_SERVICE%", "destinationAddress": "%UPSTREAM_LOCAL_ADDRESS%", "source": "%KUMA_SOURCE_SERVICE%", "sourceAddress": "%KUMA_SOURCE_ADDRESS%", "bytesReceived": "%BYTES_RECEIVED%", "bytesSent": "%BYTES_SENT%"}',
                  file: {
                    path: '/tmp/access.log'
                  }
                },
                {
                  name: 'logstash',
                  tcp: {
                    address: 'logstash.internal:9000'
                  }
                }
              ]
            }
          },
          {
            name: 'mesh-2',
            type: 'Mesh',
            mtls: {
              ca: {
                builtin: {}
              },
              enabled: true
            },
            tracing: {},
            logging: {
              backends: [
                {
                  name: 'file-tmp',
                  format: '{ "destination": "%KUMA_DESTINATION_SERVICE%", "destinationAddress": "%UPSTREAM_LOCAL_ADDRESS%", "source": "%KUMA_SOURCE_SERVICE%", "sourceAddress": "%KUMA_SOURCE_ADDRESS%", "bytesReceived": "%BYTES_RECEIVED%", "bytesSent": "%BYTES_SENT%"}',
                  file: {
                    path: '/tmp/access.log'
                  }
                },
                {
                  name: 'logstash',
                  tcp: {
                    address: 'logstash.internal:9000'
                  }
                }
              ]
            }
          },
          {
            name: 'mesh-3',
            type: 'Mesh',
            mtls: {
              ca: {
                builtin: {}
              },
              enabled: true
            },
            tracing: {},
            logging: {
              backends: [
                {
                  name: 'file-tmp',
                  format: '{ "destination": "%KUMA_DESTINATION_SERVICE%", "destinationAddress": "%UPSTREAM_LOCAL_ADDRESS%", "source": "%KUMA_SOURCE_SERVICE%", "sourceAddress": "%KUMA_SOURCE_ADDRESS%", "bytesReceived": "%BYTES_RECEIVED%", "bytesSent": "%BYTES_SENT%"}',
                  file: {
                    path: '/tmp/access.log'
                  }
                },
                {
                  name: 'logstash',
                  tcp: {
                    address: 'logstash.internal:9000'
                  }
                }
              ]
            }
          },
          {
            name: 'mesh-4',
            type: 'Mesh',
            mtls: {
              ca: {
                builtin: {}
              },
              enabled: true
            },
            tracing: {},
            logging: {
              backends: [
                {
                  name: 'file-tmp',
                  format: '{ "destination": "%KUMA_DESTINATION_SERVICE%", "destinationAddress": "%UPSTREAM_LOCAL_ADDRESS%", "source": "%KUMA_SOURCE_SERVICE%", "sourceAddress": "%KUMA_SOURCE_ADDRESS%", "bytesReceived": "%BYTES_RECEIVED%", "bytesSent": "%BYTES_SENT%"}',
                  file: {
                    path: '/tmp/access.log'
                  }
                },
                {
                  name: 'logstash',
                  tcp: {
                    address: 'logstash.internal:9000'
                  }
                }
              ]
            }
          },
          {
            name: 'mesh-5',
            type: 'Mesh',
            mtls: {
              ca: {
                builtin: {}
              },
              enabled: true
            },
            tracing: {},
            logging: {
              backends: [
                {
                  name: 'file-tmp',
                  format: '{ "destination": "%KUMA_DESTINATION_SERVICE%", "destinationAddress": "%UPSTREAM_LOCAL_ADDRESS%", "source": "%KUMA_SOURCE_SERVICE%", "sourceAddress": "%KUMA_SOURCE_ADDRESS%", "bytesReceived": "%BYTES_RECEIVED%", "bytesSent": "%BYTES_SENT%"}',
                  file: {
                    path: '/tmp/access.log'
                  }
                },
                {
                  name: 'logstash',
                  tcp: {
                    address: 'logstash.internal:9000'
                  }
                }
              ]
            }
          }
        ]
      })
      .onAny().passThrough()
  }
}
