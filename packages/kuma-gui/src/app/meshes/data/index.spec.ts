import { describe, expect, test } from 'vitest'

import { Mesh } from './index'

type TestCase<T extends (...args: any) => any> = {
  message: string
  parameters: Parameters<T>
  expected: ReturnType<T>
}

describe('meshes data transformations', () => {
  describe('Mesh', () => {
    test.each<TestCase<typeof Mesh.fromObject>>([
      {
        message: 'minimal',
        parameters: [{
          name: 'protocol-4',
          type: 'Mesh',
          creationTime: '2020-06-19T12:18:02.097986-04:00',
          modificationTime: '2020-06-19T12:18:02.097986-04:00',
          mtls: {
            enabledBackend: 'ca-2',
            backends: [
              {
                name: 'ca-1',
                type: 'provided',
                dpCert: {
                  rotation: {
                    expiration: '1d',
                  },
                },
                conf: {
                  cert: {
                    secret: 'name-of-secret',
                  },
                  key: {
                    secret: 'name-of-secret',
                  },
                },
              },
              {
                name: 'ca-2',
                type: 'BUILTIN',
              },
            ],
          },
          logging: {
            backends: [
              {
                name: 'logstash',
                type: 'tcp',
                conf: {
                  address: '127.0.0.1:5000',
                },
              },
              {
                name: 'file',
                type: 'file',
                conf: {
                  path: '/tmp/service.log',
                },
              },
            ],
          },
        }],
        expected: {
          name: 'protocol-4',
          id: 'protocol-4',
          type: 'Mesh',
          creationTime: '2020-06-19T12:18:02.097986-04:00',
          modificationTime: '2020-06-19T12:18:02.097986-04:00',
          meshServices: {
            mode: 'Disabled',
          },
          mtlsBackend: {
            name: 'ca-2',
            type: 'BUILTIN',
          },
          metricsBackend: undefined,
          mtls: {
            enabledBackend: 'ca-2',
            backends: [
              {
                name: 'ca-1',
                type: 'provided',
                dpCert: {
                  rotation: {
                    expiration: '1d',
                  },
                },
                conf: {
                  cert: {
                    secret: 'name-of-secret',
                  },
                  key: {
                    secret: 'name-of-secret',
                  },
                },
              },
              {
                name: 'ca-2',
                type: 'BUILTIN',
              },
            ],
          },
          routing: {
            zoneEgress: false,
          },
          logging: {
            backends: [
              {
                name: 'logstash',
                type: 'tcp',
                conf: {
                  address: '127.0.0.1:5000',
                },
              },
              {
                name: 'file',
                type: 'file',
                conf: {
                  path: '/tmp/service.log',
                },
              },
            ],
          },
          config: {
            name: 'protocol-4',
            type: 'Mesh',
            creationTime: '2020-06-19T12:18:02.097986-04:00',
            modificationTime: '2020-06-19T12:18:02.097986-04:00',
            mtls: {
              enabledBackend: 'ca-2',
              backends: [
                {
                  name: 'ca-1',
                  type: 'provided',
                  dpCert: {
                    rotation: {
                      expiration: '1d',
                    },
                  },
                  conf: {
                    cert: {
                      secret: 'name-of-secret',
                    },
                    key: {
                      secret: 'name-of-secret',
                    },
                  },
                },
                {
                  name: 'ca-2',
                  type: 'BUILTIN',
                },
              ],
            },
            logging: {
              backends: [
                {
                  name: 'logstash',
                  type: 'tcp',
                  conf: {
                    address: '127.0.0.1:5000',
                  },
                },
                {
                  name: 'file',
                  type: 'file',
                  conf: {
                    path: '/tmp/service.log',
                  },
                },
              ],
            },
          },
        },
      },
    ])('.fromObject: $message', ({ parameters, expected }) => {
      expect(Mesh.fromObject(...parameters)).toStrictEqual(expected)
    })
  })
})
