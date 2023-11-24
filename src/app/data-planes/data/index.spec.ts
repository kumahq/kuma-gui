import { describe, expect, test } from 'vitest'

import { getLastUpdateTime, getStatusAndReason } from './index'

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
        message: 'nothing defined is online',
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
        expected: {
          status: 'online',
          reason: [],
        },
      },
      {
        message: 'empty inbounds is online',
        parameters: [{
          mesh: 'default',
          name: 'dataplane',
          type: 'DataplaneOverview',
          creationTime: '',
          modificationTime: '',
          dataplane: {
            networking: {
              address: '',
              inbound: [],
            },
          },
        }],
        expected: {
          status: 'online',
          reason: [],
        },
      },
      {
        message: 'single healthy inbound defers to getItemStatusFromInsight (online)',
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
        message: 'single unhealthy inbound is offline with a single reason',
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
        message: 'single unhealthy inbound out of multiple is partially_degraded',
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
})
