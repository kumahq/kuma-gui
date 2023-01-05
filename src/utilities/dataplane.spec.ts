import { describe, expect, test } from '@jest/globals'

import { getStatusAndReason, getItemStatusFromInsight } from './dataplane'

import {
  DiscoverySubscription,
  DataPlaneNetworking,
} from '@/types/index.d'

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

  describe('getStatusAndReason', () => {
    type TestCases = {message: string, args: [{ networking: DataPlaneNetworking }, { subscriptions?: DiscoverySubscription[] }], expected: any}[]
    test.each(([
      {
        message: 'nothing defined is online',
        args: [{
          networking: {
            address: '',
          },
        }],
        expected: {
          status: 'online',
          reason: [],
        },
      },
      {
        message: 'empty inbounds is online',
        args: [{
          networking: {
            address: '',
            inbound: [],
          },
        }],
        expected: {
          status: 'online',
          reason: [],
        },
      },
      {
        message: 'single healthy inbound defers to getItemStatusFromInsight (online)',
        args: [{
          networking: {
            address: '',
            inbound: [{
              health: {
                ready: true,
              },
            }],
          },
        }, {
          subscriptions: [
            {
              connectTime: '1',
            },
          ],
        }],
        expected: {
          status: 'online',
          reason: [],
        },
      },
      {
        message: 'single unhealthy inbound is offline with a single reason',
        args: [{
          networking: {
            address: '',
            inbound: [{
              health: {
                ready: false,
              },
              port: 1,
              tags: {
                'kuma.io/service': 'service',
              },
            }],
          },
        }],
        expected: {
          status: 'offline',
          reason: [''],
        },
      },
      {
        message: 'single unhealthy inbound out of multiple is partially_degraded',
        args: [{
          networking: {
            address: '',
            inbound: [{
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
            }],
          },
        }],
        expected: {
          status: 'partially_degraded',
          reason: [''],
        },
      },
    ] as TestCases))('$message', (item) => {
      const actual = getStatusAndReason(...item.args)
      expect(actual.status).toBe(item.expected.status)
      expect(actual.reason.length).toBe(item.expected.reason.length)
    })
  })
})
