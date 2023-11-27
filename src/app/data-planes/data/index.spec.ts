import { describe, expect, test } from 'vitest'

import { getLastUpdateTime, getStatusAndReason, getTags } from './index'

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
})
