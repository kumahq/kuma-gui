import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'

import { Dataplane, DataplaneInsight, DataplaneNetworking, DataplaneOverview } from './index'

type TestCase<T extends (...args: any) => any> = {
  message: string
  parameters: Parameters<T>
  expected: ReturnType<T>
}

describe('dataplanes data transformations', () => {
  describe('DataplaneNetworking', () => {
    test.each<TestCase<typeof DataplaneNetworking.fromObject>>([
      {
        message: 'minimal',
        parameters: [{
          address: '',
        }],
        expected: {
          address: '',
        },
      },
    ])('.fromObject: $message', ({ parameters, expected }) => {
      expect(DataplaneNetworking.fromObject(...parameters)).toStrictEqual(expected)
    })
  })

  describe('Dataplane', () => {
    test.each<TestCase<typeof Dataplane.fromObject>>([
      {
        message: 'minimal',
        parameters: [{
          mesh: 'default',
          name: 'dataplane',
          type: 'Dataplane',
          creationTime: '',
          modificationTime: '',
          networking: {
            address: '',
          },
        }],
        expected: {
          mesh: 'default',
          name: 'dataplane',
          type: 'Dataplane',
          creationTime: '',
          modificationTime: '',
          networking: {
            address: '',
          },
        },
      },
    ])('.fromObject: $message', ({ parameters, expected }) => {
      expect(Dataplane.fromObject(...parameters)).toStrictEqual(expected)
    })
  })

  describe('DataplaneInsight', () => {
    test.each<TestCase<typeof DataplaneInsight.fromObject>>([
      {
        message: 'no insight',
        parameters: [undefined],
        expected: {
          subscriptions: [],
          connectedSubscription: undefined,
        },
      },
      {
        message: 'empty subscriptions',
        parameters: [{
          subscriptions: [],
        }],
        expected: {
          subscriptions: [],
          connectedSubscription: undefined,
        },
      },
      {
        message: 'connected subscription',
        parameters: [{
          subscriptions: [
            {
              id: '',
              controlPlaneInstanceId: '',
              status: {
                lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                total: {},
                cds: {},
                eds: {},
                lds: {},
                rds: {},
              },
              connectTime: '2021-07-13T09:03:11.614941842Z',
            },
          ],
        }],
        expected: {
          subscriptions: [
            {
              id: '',
              controlPlaneInstanceId: '',
              status: {
                lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                total: {},
                cds: {},
                eds: {},
                lds: {},
                rds: {},
              },
              connectTime: '2021-07-13T09:03:11.614941842Z',
            },
          ],
          connectedSubscription: {
            id: '',
            controlPlaneInstanceId: '',
            status: {
              lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
              total: {},
              cds: {},
              eds: {},
              lds: {},
              rds: {},
            },
            connectTime: '2021-07-13T09:03:11.614941842Z',
          },
        },
      },
      {
        message: 'disconnected subscription',
        parameters: [{
          subscriptions: [
            {
              id: '',
              controlPlaneInstanceId: '',
              status: {
                lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                total: {},
                cds: {},
                eds: {},
                lds: {},
                rds: {},
              },
              connectTime: '2021-07-13T09:03:11.614941842Z',
              disconnectTime: '2021-07-14T09:03:11.614941842Z',
            },
          ],
        }],
        expected: {
          subscriptions: [
            {
              id: '',
              controlPlaneInstanceId: '',
              status: {
                lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                total: {},
                cds: {},
                eds: {},
                lds: {},
                rds: {},
              },
              connectTime: '2021-07-13T09:03:11.614941842Z',
              disconnectTime: '2021-07-14T09:03:11.614941842Z',
            },
          ],
          connectedSubscription: undefined,
        },
      },
    ])('.fromObject: $message', ({ parameters, expected }) => {
      expect(DataplaneInsight.fromObject(...parameters)).toStrictEqual(expected)
    })
  })

  describe('DataplaneOverview', () => {
    beforeAll(() => {
      vi.useFakeTimers()
      // Needed to test certificate expiration.
      vi.setSystemTime(new Date('2023-11-28T13:00:00Z'))
    })

    afterAll(() => {
      vi.useRealTimers()
    })

    test.each<TestCase<typeof DataplaneOverview.fromObject>>([
      {
        message: 'Standard proxy: empty subscriptions -> offline',
        parameters: [
          {
            mesh: 'default',
            name: 'dataplane',
            type: 'DataplaneOverview',
            creationTime: '',
            modificationTime: '',
            dataplane: {
              networking: {
                address: '',
              },
            },
          },
          true,
        ],
        expected: {
          mesh: 'default',
          name: 'dataplane',
          type: 'DataplaneOverview',
          creationTime: '',
          modificationTime: '',
          dataplane: {
            networking: {
              address: '',
            },
          },
          dataplaneInsight: {
            subscriptions: [],
            connectedSubscription: undefined,
          },
          dataplaneType: 'standard',
          status: 'offline',
          unhealthyInbounds: [],
          lastUpdateTime: undefined,
          warnings: [],
          isCertExpired: false,
          services: [],
        },
      },
      {
        message: 'Standard proxy: healthy inbounds + connected subscription -> online',
        parameters: [
          {
            mesh: 'default',
            name: 'dataplane',
            type: 'DataplaneOverview',
            creationTime: '',
            modificationTime: '',
            dataplane: {
              networking: {
                address: '',
                inbound: [
                  {
                    health: {
                      ready: true,
                    },
                    tags: {
                      'kuma.io/service': '',
                      'kuma.io/zone': '',
                    },
                    port: 1,
                  },
                ],
              },
            },
            dataplaneInsight: {
              mTLS: {
                certificateExpirationTime: '2023-11-27T13:00:00Z',
                lastCertificateRegeneration: '',
                certificateRegenerations: 0,
                issuedBackend: '',
                supportedBackends: [],
              },
              subscriptions: [
                {
                  id: '',
                  controlPlaneInstanceId: '',
                  status: {
                    lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                    total: {},
                    cds: {},
                    eds: {},
                    lds: {},
                    rds: {},
                  },
                  connectTime: '2021-07-13T09:03:11.614941842Z',
                  version: {
                    kumaDp: {
                      version: '1.2.3',
                      gitTag: '',
                      gitCommit: '',
                      buildDate: '',
                      kumaCpCompatible: false,
                    },
                    envoy: {
                      version: '4.5.6',
                      build: '',
                      kumaDpCompatible: false,
                    },
                    dependencies: {},
                  },
                },
              ],
            },
          },
          true,
        ],
        expected: {
          mesh: 'default',
          name: 'dataplane',
          type: 'DataplaneOverview',
          creationTime: '',
          modificationTime: '',
          dataplane: {
            networking: {
              address: '',
              inbound: [
                {
                  health: {
                    ready: true,
                  },
                  tags: {
                    'kuma.io/service': '',
                    'kuma.io/zone': '',
                  },
                  port: 1,
                },
              ],
            },
          },
          dataplaneInsight: {
            mTLS: {
              certificateExpirationTime: '2023-11-27T13:00:00Z',
              lastCertificateRegeneration: '',
              certificateRegenerations: 0,
              issuedBackend: '',
              supportedBackends: [],
            },
            subscriptions: [
              {
                id: '',
                controlPlaneInstanceId: '',
                status: {
                  lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                  total: {},
                  cds: {},
                  eds: {},
                  lds: {},
                  rds: {},
                },
                connectTime: '2021-07-13T09:03:11.614941842Z',
                version: {
                  kumaDp: {
                    version: '1.2.3',
                    gitTag: '',
                    gitCommit: '',
                    buildDate: '',
                    kumaCpCompatible: false,
                  },
                  envoy: {
                    version: '4.5.6',
                    build: '',
                    kumaDpCompatible: false,
                  },
                  dependencies: {},
                },
              },
            ],
            connectedSubscription: {
              id: '',
              controlPlaneInstanceId: '',
              status: {
                lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                total: {},
                cds: {},
                eds: {},
                lds: {},
                rds: {},
              },
              connectTime: '2021-07-13T09:03:11.614941842Z',
              version: {
                kumaDp: {
                  version: '1.2.3',
                  gitTag: '',
                  gitCommit: '',
                  buildDate: '',
                  kumaCpCompatible: false,
                },
                envoy: {
                  version: '4.5.6',
                  build: '',
                  kumaDpCompatible: false,
                },
                dependencies: {},
              },
            },
          },
          dataplaneType: 'standard',
          status: 'online',
          unhealthyInbounds: [],
          lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
          warnings: [
            {
              kind: 'INCOMPATIBLE_UNSUPPORTED_KUMA_DP',
              payload: {
                kumaDp: '1.2.3',
              },
            },
            {
              kind: 'INCOMPATIBLE_UNSUPPORTED_ENVOY',
              payload: {
                envoy: '4.5.6',
                kumaDp: '1.2.3',
              },
            },
            {
              kind: 'INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS',
              payload: {
                kumaDp: '1.2.3',
              },
            },
          ],
          isCertExpired: true,
          services: [''],
        },
      },
      {
        message: 'Standard proxy: healthy inbounds + disconnected subscription -> offline',
        parameters: [
          {
            mesh: 'default',
            name: 'dataplane',
            type: 'DataplaneOverview',
            creationTime: '',
            modificationTime: '',
            dataplane: {
              networking: {
                address: '',
                inbound: [
                  {
                    health: {
                      ready: true,
                    },
                    tags: {
                      'kuma.io/service': '',
                    },
                    port: 1,
                  },
                ],
              },
            },
            dataplaneInsight: {
              mTLS: {
                certificateExpirationTime: '2023-11-29T13:00:00Z',
                lastCertificateRegeneration: '',
                certificateRegenerations: 0,
                issuedBackend: '',
                supportedBackends: [],
              },
              subscriptions: [
                {
                  id: '',
                  controlPlaneInstanceId: '',
                  status: {
                    lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                    total: {},
                    cds: {},
                    eds: {},
                    lds: {},
                    rds: {},
                  },
                  connectTime: '2021-07-13T09:03:11.614941842Z',
                  disconnectTime: '2021-07-13T09:03:11.614941842Z',
                },
              ],
            },
          },
          true,
        ],
        expected: {
          mesh: 'default',
          name: 'dataplane',
          type: 'DataplaneOverview',
          creationTime: '',
          modificationTime: '',
          dataplane: {
            networking: {
              address: '',
              inbound: [
                {
                  health: {
                    ready: true,
                  },
                  tags: {
                    'kuma.io/service': '',
                  },
                  port: 1,
                },
              ],
            },
          },
          dataplaneInsight: {
            mTLS: {
              certificateExpirationTime: '2023-11-29T13:00:00Z',
              lastCertificateRegeneration: '',
              certificateRegenerations: 0,
              issuedBackend: '',
              supportedBackends: [],
            },
            subscriptions: [
              {
                id: '',
                controlPlaneInstanceId: '',
                status: {
                  lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                  total: {},
                  cds: {},
                  eds: {},
                  lds: {},
                  rds: {},
                },
                connectTime: '2021-07-13T09:03:11.614941842Z',
                disconnectTime: '2021-07-13T09:03:11.614941842Z',
              },
            ],
            connectedSubscription: undefined,
          },
          dataplaneType: 'standard',
          status: 'offline',
          unhealthyInbounds: [],
          lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
          warnings: [],
          isCertExpired: false,
          services: [''],
        },
      },
      {
        message: 'Standard proxy: only unhealthy inbounds -> offline',
        parameters: [
          {
            mesh: 'default',
            name: 'dataplane',
            type: 'DataplaneOverview',
            creationTime: '',
            modificationTime: '',
            dataplane: {
              networking: {
                address: '',
                inbound: [
                  {
                    health: {
                      ready: false,
                    },
                    tags: {
                      'kuma.io/service': '',
                    },
                    port: 1,
                  },
                ],
              },
            },
            dataplaneInsight: {
              subscriptions: [
                {
                  id: '',
                  controlPlaneInstanceId: '',
                  status: {
                    lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                    total: {},
                    cds: {},
                    eds: {},
                    lds: {},
                    rds: {},
                  },
                  connectTime: '2021-07-13T09:03:11.614941842Z',
                },
              ],
            },
          },
          true,
        ],
        expected: {
          mesh: 'default',
          name: 'dataplane',
          type: 'DataplaneOverview',
          creationTime: '',
          modificationTime: '',
          dataplane: {
            networking: {
              address: '',
              inbound: [
                {
                  health: {
                    ready: false,
                  },
                  tags: {
                    'kuma.io/service': '',
                  },
                  port: 1,
                },
              ],
            },
          },
          dataplaneInsight: {
            subscriptions: [
              {
                id: '',
                controlPlaneInstanceId: '',
                status: {
                  lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                  total: {},
                  cds: {},
                  eds: {},
                  lds: {},
                  rds: {},
                },
                connectTime: '2021-07-13T09:03:11.614941842Z',
              },
            ],
            connectedSubscription: {
              id: '',
              controlPlaneInstanceId: '',
              status: {
                lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                total: {},
                cds: {},
                eds: {},
                lds: {},
                rds: {},
              },
              connectTime: '2021-07-13T09:03:11.614941842Z',
            },
          },
          dataplaneType: 'standard',
          status: 'offline',
          unhealthyInbounds: [{
            port: 1,
            service: '',
          }],
          lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
          warnings: [],
          isCertExpired: false,
          services: [''],
        },
      },
      {
        message: 'Standard proxy: partially unhealthy inbounds -> partially degraded',
        parameters: [
          {
            mesh: 'default',
            name: 'dataplane',
            type: 'DataplaneOverview',
            creationTime: '',
            modificationTime: '',
            dataplane: {
              networking: {
                address: '',
                inbound: [
                  {
                    health: {
                      ready: false,
                    },
                    port: 1,
                    tags: {
                      'kuma.io/service': 'service-1',
                      'kuma.io/zone': 'zone-1',
                    },
                  },
                  {
                    health: {
                      ready: true,
                    },
                    port: 1,
                    tags: {
                      'kuma.io/service': 'service-2',
                      'kuma.io/zone': 'zone-1',
                    },
                  },
                ],
              },
            },
            dataplaneInsight: {
              subscriptions: [
                {
                  id: '',
                  controlPlaneInstanceId: '',
                  status: {
                    lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                    total: {},
                    cds: {},
                    eds: {},
                    lds: {},
                    rds: {},
                  },
                  connectTime: '2021-07-13T09:03:11.614941842Z',
                },
              ],
            },
          },
          true,
        ],
        expected: {
          mesh: 'default',
          name: 'dataplane',
          type: 'DataplaneOverview',
          creationTime: '',
          modificationTime: '',
          dataplane: {
            networking: {
              address: '',
              inbound: [
                {
                  health: {
                    ready: false,
                  },
                  port: 1,
                  tags: {
                    'kuma.io/service': 'service-1',
                    'kuma.io/zone': 'zone-1',
                  },
                },
                {
                  health: {
                    ready: true,
                  },
                  port: 1,
                  tags: {
                    'kuma.io/service': 'service-2',
                    'kuma.io/zone': 'zone-1',
                  },
                },
              ],
            },
          },
          dataplaneInsight: {
            subscriptions: [
              {
                id: '',
                controlPlaneInstanceId: '',
                status: {
                  lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                  total: {},
                  cds: {},
                  eds: {},
                  lds: {},
                  rds: {},
                },
                connectTime: '2021-07-13T09:03:11.614941842Z',
              },
            ],
            connectedSubscription: {
              id: '',
              controlPlaneInstanceId: '',
              status: {
                lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                total: {},
                cds: {},
                eds: {},
                lds: {},
                rds: {},
              },
              connectTime: '2021-07-13T09:03:11.614941842Z',
            },
          },
          dataplaneType: 'standard',
          status: 'partially_degraded',
          unhealthyInbounds: [{
            port: 1,
            service: 'service-1',
          }],
          lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
          warnings: [],
          isCertExpired: false,
          services: ['service-1', 'service-2'],
        },
      },
      {
        message: 'Delegated gateway + single subscription + online',
        parameters: [
          {
            mesh: 'default',
            name: 'dataplane',
            type: 'DataplaneOverview',
            creationTime: '',
            modificationTime: '',
            dataplane: {
              networking: {
                address: '',
                gateway: {
                  type: 'DELEGATED',
                  tags: {
                    'kuma.io/service': 'service-1',
                    'kuma.io/zone': 'zone-1',
                    'kuma.io/protocol': 'http',
                  },
                },
              },
            },
            dataplaneInsight: {
              subscriptions: [
                {
                  id: '',
                  controlPlaneInstanceId: '',
                  status: {
                    lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                    total: {},
                    cds: {},
                    eds: {},
                    lds: {},
                    rds: {},
                  },
                  connectTime: '2021-07-13T09:03:11.614941842Z',
                },
              ],
            },
          },
          true,
        ],
        expected: {
          mesh: 'default',
          name: 'dataplane',
          type: 'DataplaneOverview',
          creationTime: '',
          modificationTime: '',
          dataplane: {
            networking: {
              address: '',
              gateway: {
                type: 'DELEGATED',
                tags: {
                  'kuma.io/service': 'service-1',
                  'kuma.io/zone': 'zone-1',
                  'kuma.io/protocol': 'http',
                },
              },
            },
          },
          dataplaneInsight: {
            subscriptions: [
              {
                id: '',
                controlPlaneInstanceId: '',
                status: {
                  lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                  total: {},
                  cds: {},
                  eds: {},
                  lds: {},
                  rds: {},
                },
                connectTime: '2021-07-13T09:03:11.614941842Z',
              },
            ],
            connectedSubscription: {
              id: '',
              controlPlaneInstanceId: '',
              status: {
                lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                total: {},
                cds: {},
                eds: {},
                lds: {},
                rds: {},
              },
              connectTime: '2021-07-13T09:03:11.614941842Z',
            },
          },
          dataplaneType: 'delegated',
          status: 'online',
          unhealthyInbounds: [],
          lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
          warnings: [],
          isCertExpired: false,
          services: ['service-1'],
        },
      },
      {
        message: 'Delegated gateway + single subscription + online',
        parameters: [
          {
            mesh: 'default',
            name: 'dataplane',
            type: 'DataplaneOverview',
            creationTime: '',
            modificationTime: '',
            dataplane: {
              networking: {
                address: '',
                gateway: {
                  tags: {
                    'kuma.io/service': 'service-1',
                    'kuma.io/zone': 'zone-1',
                    'kuma.io/protocol': 'http',
                  },
                },
              },
            },
            dataplaneInsight: {
              subscriptions: [
                {
                  id: '',
                  controlPlaneInstanceId: '',
                  status: {
                    lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                    total: {},
                    cds: {},
                    eds: {},
                    lds: {},
                    rds: {},
                  },
                  connectTime: '2021-07-13T09:03:11.614941842Z',
                },
              ],
            },
          },
          true,
        ],
        expected: {
          mesh: 'default',
          name: 'dataplane',
          type: 'DataplaneOverview',
          creationTime: '',
          modificationTime: '',
          dataplane: {
            networking: {
              address: '',
              gateway: {
                tags: {
                  'kuma.io/service': 'service-1',
                  'kuma.io/zone': 'zone-1',
                  'kuma.io/protocol': 'http',
                },
              },
            },
          },
          dataplaneInsight: {
            subscriptions: [
              {
                id: '',
                controlPlaneInstanceId: '',
                status: {
                  lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                  total: {},
                  cds: {},
                  eds: {},
                  lds: {},
                  rds: {},
                },
                connectTime: '2021-07-13T09:03:11.614941842Z',
              },
            ],
            connectedSubscription: {
              id: '',
              controlPlaneInstanceId: '',
              status: {
                lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                total: {},
                cds: {},
                eds: {},
                lds: {},
                rds: {},
              },
              connectTime: '2021-07-13T09:03:11.614941842Z',
            },
          },
          dataplaneType: 'delegated',
          status: 'online',
          unhealthyInbounds: [],
          lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
          warnings: [],
          isCertExpired: false,
          services: ['service-1'],
        },
      },
      {
        message: 'Built-in gateway + multiple subscriptions + offline',
        parameters: [
          {
            mesh: 'default',
            name: 'dataplane',
            type: 'DataplaneOverview',
            creationTime: '',
            modificationTime: '',
            dataplane: {
              networking: {
                address: '',
                gateway: {
                  type: 'BUILTIN',
                  tags: {
                    'kuma.io/service': '',
                  },
                },
              },
            },
            dataplaneInsight: {
              subscriptions: [
                {
                  id: '',
                  controlPlaneInstanceId: '',
                  status: {
                    lastUpdateTime: '2020-07-13T09:03:11.614941842Z',
                    total: {},
                    cds: {},
                    eds: {},
                    lds: {},
                    rds: {},
                  },
                  connectTime: '2021-07-13T09:03:11.614941842Z',
                  disconnectTime: '2021-07-13T09:03:11.614941842Z',
                },
                {
                  id: '',
                  controlPlaneInstanceId: '',
                  status: {
                    lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                    total: {},
                    cds: {},
                    eds: {},
                    lds: {},
                    rds: {},
                  },
                  connectTime: '2021-07-13T09:03:11.614941842Z',
                  disconnectTime: '2021-07-13T09:03:11.614941842Z',
                },
              ],
            },
          },
          true,
        ],
        expected: {
          mesh: 'default',
          name: 'dataplane',
          type: 'DataplaneOverview',
          creationTime: '',
          modificationTime: '',
          dataplane: {
            networking: {
              address: '',
              gateway: {
                type: 'BUILTIN',
                tags: {
                  'kuma.io/service': '',
                },
              },
            },
          },
          dataplaneInsight: {
            subscriptions: [
              {
                id: '',
                controlPlaneInstanceId: '',
                status: {
                  lastUpdateTime: '2020-07-13T09:03:11.614941842Z',
                  total: {},
                  cds: {},
                  eds: {},
                  lds: {},
                  rds: {},
                },
                connectTime: '2021-07-13T09:03:11.614941842Z',
                disconnectTime: '2021-07-13T09:03:11.614941842Z',
              },
              {
                id: '',
                controlPlaneInstanceId: '',
                status: {
                  lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
                  total: {},
                  cds: {},
                  eds: {},
                  lds: {},
                  rds: {},
                },
                connectTime: '2021-07-13T09:03:11.614941842Z',
                disconnectTime: '2021-07-13T09:03:11.614941842Z',
              },
            ],
            connectedSubscription: undefined,
          },
          dataplaneType: 'builtin',
          status: 'offline',
          unhealthyInbounds: [],
          lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
          warnings: [],
          isCertExpired: false,
          services: [''],
        },
      },
    ])('.fromObject: $message', ({ parameters, expected }) => {
      expect(DataplaneOverview.fromObject(...parameters)).toStrictEqual(expected)
    })

    test.each<TestCase<typeof DataplaneOverview.fromCollection>>([
    ])('.fromCollection: $message', ({ parameters, expected }) => {
      expect(DataplaneOverview.fromCollection(...parameters)).toStrictEqual(expected)
    })
  })
})
