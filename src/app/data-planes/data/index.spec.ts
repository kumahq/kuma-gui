import { describe, expect, test } from 'vitest'

import { getFormattedLastUpdateTime } from './index'
import type { DiscoverySubscription } from '@/types/index.d'

type LastUpdateTimeTestCase = {
  message: string
  subscriptions: DiscoverySubscription[]
  expected: string | null
}

describe('dataplanes data transformations', () => {
  describe('getFormattedLastUpdateTime', () => {
    test.each([
      {
        message: 'empty subscriptions',
        subscriptions: [],
        expected: null,
      },
      {
        message: 'single subscription',
        subscriptions: [
          {
            status: {
              lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
            },
          },
        ],
        expected: 'Jul 13, 2021, 9:03 AM',
      },
      {
        message: 'multiple subscriptions',
        subscriptions: [
          {
            status: {
              lastUpdateTime: '2020-07-13T09:03:11.614941842Z',
            },
          },
          {
            status: {
              lastUpdateTime: '2021-07-13T09:03:11.614941842Z',
            },
          },
        ],
        expected: 'Jul 13, 2021, 9:03 AM',
      },
    ] as LastUpdateTimeTestCase[])('$message', (item) => {
      expect(getFormattedLastUpdateTime(item.subscriptions)).toStrictEqual(item.expected)
    })
  })
})
