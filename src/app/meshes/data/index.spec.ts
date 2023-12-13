import { describe, expect, test } from 'vitest'

import { Mesh, MeshInsight } from './index'

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
          type: 'Mesh',
          creationTime: '2020-06-19T12:18:02.097986-04:00',
          modificationTime: '2020-06-19T12:18:02.097986-04:00',
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

  describe('MeshInsight', () => {
    test.each<TestCase<typeof MeshInsight.fromObject>>([
      {
        message: 'minimal',
        parameters: [{
          type: 'MeshInsight',
          name: 'protocol-4',
          creationTime: '2021-01-29T07:10:02.339031+01:00',
          modificationTime: '2021-01-29T07:29:02.314448+01:00',
          lastSync: '2021-01-29T06:29:02.314447Z',
          dataplanes: {
            total: 68,
            online: 28,
            partiallyDegraded: 40,
          },
          dataplanesByType: {
            standard: {
              total: 12,
              online: 12,
            },
            gateway: {
              total: 56,
              online: 56,
            },
            gatewayBuiltin: {
              total: 28,
              online: 16,
              partiallyDegraded: 2,
              offline: 10,
            },
            gatewayDelegated: {
              total: 28,
              partiallyDegraded: 18,
              offline: 10,
            },
          },
          policies: {
            FaultInjection: {
              total: 6,
            },
            HealthCheck: {
              total: 3,
            },
          },
          dpVersions: {
            kumaDp: {
              '6.5.0': {
                total: 3,
                online: 0,
              },
            },
            envoy: {
              '2.9.3': {
                total: 3,
                online: 3,
              },
            },
          },
          mTLS: {
            issuedBackends: {
              'ca-2': {
                total: 10,
                online: 6,
              },
              'ca-1': {
                total: 3,
                online: 0,
              },
            },
            supportedBackends: {
              'ca-2': {
                total: 10,
                online: 6,
              },
              'ca-1': {
                total: 2,
                online: 1,
              },
            },
          },
          services: {
            total: 7,
            internal: 7,
          },
        }],
        expected: {
          type: 'MeshInsight',
          name: 'protocol-4',
          creationTime: '2021-01-29T07:10:02.339031+01:00',
          modificationTime: '2021-01-29T07:29:02.314448+01:00',
          lastSync: '2021-01-29T06:29:02.314447Z',
          dataplanes: {
            total: 68,
            online: 28,
            partiallyDegraded: 40,
            offline: 0,
          },
          dataplanesByType: {
            standard: {
              total: 12,
              online: 12,
              partiallyDegraded: 0,
              offline: 0,
            },
            gateway: {
              total: 56,
              online: 56,
              partiallyDegraded: 0,
              offline: 0,
            },
            gatewayBuiltin: {
              total: 28,
              online: 16,
              partiallyDegraded: 2,
              offline: 10,
            },
            gatewayDelegated: {
              total: 28,
              online: 0,
              partiallyDegraded: 18,
              offline: 10,
            },
          },
          policies: {
            FaultInjection: {
              total: 6,
            },
            HealthCheck: {
              total: 3,
            },
          },
          totalPolicyCount: 9,
          dpVersions: {
            kumaDp: {
              '6.5.0': {
                total: 3,
                online: 0,
              },
            },
            envoy: {
              '2.9.3': {
                total: 3,
                online: 3,
              },
            },
          },
          mTLS: {
            issuedBackends: {
              'ca-2': {
                total: 10,
                online: 6,
              },
              'ca-1': {
                total: 3,
                online: 0,
              },
            },
            supportedBackends: {
              'ca-2': {
                total: 10,
                online: 6,
              },
              'ca-1': {
                total: 2,
                online: 1,
              },
            },
          },
          services: {
            total: 7,
            internal: 7,
            external: 0,
          },
        },
      },
    ])('.fromObject: $message', ({ parameters, expected }) => {
      expect(MeshInsight.fromObject(...parameters)).toStrictEqual(expected)
    })
  })
})
