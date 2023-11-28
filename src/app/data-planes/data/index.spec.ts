import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'

import { getDataplaneType, getIsCertExpired, getLastUpdateTime, getStatusAndReason, getTags, getWarnings } from './index'

type TestCase<T extends (...args: any) => any> = {
  message: string
  parameters: Parameters<T>
  expected: ReturnType<T>
}

describe('dataplanes data transformations', () => {
  describe('getLastUpdateTime', () => {
    test.each<TestCase<typeof getLastUpdateTime>>([
      {
        message: 'empty subscriptions',
        parameters: [[]],
        expected: undefined,
      },
      {
        message: 'single subscription',
        parameters: [[
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
          },
        ]],
        expected: '2021-07-13T09:03:11.614941842Z',
      },
      {
        message: 'multiple subscriptions',
        parameters: [[
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
          },
        ]],
        expected: '2021-07-13T09:03:11.614941842Z',
      },
    ])('$message', ({ parameters, expected }) => {
      expect(getLastUpdateTime(...parameters)).toStrictEqual(expected)
    })
  })

  describe('getStatusAndReason', () => {
    test.each<TestCase<typeof getStatusAndReason>>([
      {
        message: 'Built-in gateway: status determination based on subscriptions (online)',
        parameters: [{
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
                connectTime: '1',
                status: {
                  lastUpdateTime: '',
                  total: {},
                  cds: {},
                  eds: {},
                  lds: {},
                  rds: {},
                },
              },
            ],
          },
        }],
        expected: {
          status: 'online',
          reason: [],
        },
      },
      {
        message: 'Built-in gateway: status determination based on subscriptions (offline)',
        parameters: [{
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
                connectTime: '1',
                disconnectTime: '1',
                status: {
                  lastUpdateTime: '',
                  total: {},
                  cds: {},
                  eds: {},
                  lds: {},
                  rds: {},
                },
              },
            ],
          },
        }],
        expected: {
          status: 'offline',
          reason: [],
        },
      },
      {
        message: 'Standard proxy: status determination based on subscriptions (online)',
        parameters: [{
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
            subscriptions: [
              {
                id: '',
                controlPlaneInstanceId: '',
                connectTime: '1',
                status: {
                  lastUpdateTime: '',
                  total: {},
                  cds: {},
                  eds: {},
                  lds: {},
                  rds: {},
                },
              },
            ],
          },
        }],
        expected: {
          status: 'online',
          reason: [],
        },
      },
      {
        message: 'Standard proxy: status determination based on subscriptions (offline)',
        parameters: [{
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
            subscriptions: [
              {
                id: '',
                controlPlaneInstanceId: '',
                connectTime: '1',
                disconnectTime: '1',
                status: {
                  lastUpdateTime: '',
                  total: {},
                  cds: {},
                  eds: {},
                  lds: {},
                  rds: {},
                },
              },
            ],
          },
        }],
        expected: {
          status: 'offline',
          reason: [],
        },
      },
      {
        message: 'Standard proxy: one unhealthy inbound out of one inbound means offline',
        parameters: [{
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
                    'kuma.io/service': 'service',
                  },
                },
              ],
            },
          },
        }],
        expected: {
          status: 'offline',
          reason: ['Inbound on port 1 is not ready (kuma.io/service: service)'],
        },
      },
      {
        message: 'Standard proxy: one unhealthy inbound out of two inbounds means partially_degraded',
        parameters: [{
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
                    'kuma.io/service': 'service',
                  },
                },
                {
                  health: {
                    ready: true,
                  },
                  port: 1,
                  tags: {
                    'kuma.io/service': '',
                  },
                },
              ],
            },
          },
        }],
        expected: {
          status: 'partially_degraded',
          reason: ['Inbound on port 1 is not ready (kuma.io/service: service)'],
        },
      },
    ])('$message', ({ parameters, expected }) => {
      expect(getStatusAndReason(...parameters)).toStrictEqual(expected)
    })
  })

  describe('getTags', () => {
    test.each<TestCase<typeof getTags>>([
      {
        message: 'no tags',
        parameters: [{
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
        }],
        expected: [],
      },
      {
        message: 'tags from inbounds',
        parameters: [{
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
                    'kuma.io/service': 'service-1',
                    'kuma.io/zone': 'zone-1',
                  },
                  port: 1,
                },
                {
                  health: {
                    ready: true,
                  },
                  tags: {
                    'kuma.io/service': 'service-2',
                    'kuma.io/protocol': 'http',
                  },
                  port: 1,
                },
              ],
            },
          },
        }],
        expected: [
          { label: 'kuma.io/protocol', value: 'http' },
          { label: 'kuma.io/service', value: 'service-1' },
          { label: 'kuma.io/service', value: 'service-2' },
          { label: 'kuma.io/zone', value: 'zone-1' },
        ],
      },
      {
        message: 'tags from gateway',
        parameters: [{
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
        }],
        expected: [
          { label: 'kuma.io/protocol', value: 'http' },
          { label: 'kuma.io/service', value: 'service-1' },
          { label: 'kuma.io/zone', value: 'zone-1' },
        ],
      },
    ])('$message', ({ parameters, expected }) => {
      expect(getTags(...parameters)).toStrictEqual(expected)
    })
  })

  describe('getIsCertExpired', () => {
    beforeAll(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2023-11-28T13:00:00Z'))
    })

    afterAll(() => {
      vi.useRealTimers()
    })

    test.each<TestCase<typeof getIsCertExpired>>([
      {
        message: 'no mTLS',
        parameters: [{
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
        }],
        expected: false,
      },
      {
        message: 'mTLS cert expired',
        parameters: [{
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
            mTLS: {
              certificateExpirationTime: '2023-11-27T13:00:00Z',
              lastCertificateRegeneration: '',
              certificateRegenerations: 0,
              issuedBackend: '',
              supportedBackends: [],
            },
            subscriptions: [],
          },
        }],
        expected: true,
      },
      {
        message: 'mTLS cert not expired',
        parameters: [{
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
            mTLS: {
              certificateExpirationTime: '2023-11-29T13:00:00Z',
              lastCertificateRegeneration: '',
              certificateRegenerations: 0,
              issuedBackend: '',
              supportedBackends: [],
            },
            subscriptions: [],
          },
        }],
        expected: false,
      },
    ])('$message', (item) => {
      expect(getIsCertExpired(...item.parameters)).toStrictEqual(item.expected)
    })
  })

  describe('getWarnings', () => {
    test.each<TestCase<typeof getWarnings>>([
      {
        message: 'no insights',
        parameters: [{
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
        }, false],
        expected: [],
      },
      {
        message: 'all warnings',
        parameters: [{
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
                    'kuma.io/zone': 'zone-1',
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
                  lastUpdateTime: '2020-07-13T09:03:11.614941842Z',
                  total: {},
                  cds: {},
                  eds: {},
                  lds: {},
                  rds: {},
                },
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
        }, true],
        expected: [
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
      },
    ])('$message', ({ parameters, expected }) => {
      expect(getWarnings(...parameters)).toStrictEqual(expected)
    })
  })

  describe('getDataplaneType', () => {
    test.each<TestCase<typeof getDataplaneType>>([
      {
        message: 'Standard proxy',
        parameters: [{
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
        }],
        expected: 'standard',
      },
      {
        message: 'Built-in gateway',
        parameters: [{
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
        }],
        expected: 'builtin',
      },
      {
        message: 'Delegated gateway (explicit)',
        parameters: [{
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
                  'kuma.io/service': '',
                },
              },
            },
          },
        }],
        expected: 'delegated',
      },
      {
        message: 'Delegated gateway (implicit)',
        parameters: [{
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
                  'kuma.io/service': '',
                },
              },
            },
          },
        }],
        expected: 'delegated',
      },
    ])('$message', ({ parameters, expected }) => {
      expect(getDataplaneType(...parameters)).toStrictEqual(expected)
    })
  })
})
