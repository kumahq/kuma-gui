import { describe, expect, test } from 'vitest'

import { getItemStatusFromInsight } from './dataplane'
import type { DiscoverySubscription } from '@/types/index.d'

describe('utilities/dataplane', () => {
  describe('getItemStatusFromInsight', () => {
    type TestCases = {message: string, args: [{ subscriptions?: DiscoverySubscription[] }], expected: string}[]
    test.each(([
      {
        message: 'undefined insight is offline',
        args: [undefined],
        expected: 'offline',
      },
      {
        message: 'undefined subscriptions is offline',
        args: [{}],
        expected: 'offline',
      },
      {
        message: 'single connected subscription is online',
        args: [{
          subscriptions: [
            {
              connectTime: '1',
            },
          ],
        }],
        expected: 'online',
      },
      {
        message: 'single disconnected subscription is offline',
        args: [{
          subscriptions: [
            {
              connectTime: '1',
              disconnectTime: '2',
            },
          ],
        }],
        expected: 'offline',
      },
      {
        message: 'multiple subscriptions with a single connected is online',
        args: [{
          subscriptions: [
            {
              connectTime: '1',
            },
            {
              connectTime: '1',
              disconnectTime: '2',
            },
          ],
        }],
        expected: 'online',
      },
    ] as TestCases))('$message', (item) => {
      expect(getItemStatusFromInsight(...item.args)).toBe(item.expected)
    })
  })
})
