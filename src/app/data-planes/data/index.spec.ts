import { describe, expect, test } from 'vitest'

import { getLastUpdateTime } from './index'
import type { DiscoverySubscription } from '@/types/index.d'

type LastUpdateTimeTestCase = {
  message: string
  subscriptions: DiscoverySubscription[]
  expected: string | undefined
}

describe('dataplanes data transformations', () => {
  describe('getLastUpdateTime', () => {
    test.each([
      {
        message: 'empty subscriptions',
        subscriptions: [],
        expected: undefined,
      },
      {
        message: 'single subscription',
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
          },
        ],
        expected: '2021-07-13T09:03:11.614941842Z',
      },
      {
        message: 'multiple subscriptions',
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
        ],
        expected: '2021-07-13T09:03:11.614941842Z',
      },
    ])('$message', (item: LastUpdateTimeTestCase) => {
      expect(getLastUpdateTime(item.subscriptions)).toStrictEqual(item.expected)
    })
  })
})
