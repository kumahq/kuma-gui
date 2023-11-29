import { describe, expect, test } from 'vitest'

import { getIsConnected } from './index'

type TestCase<T extends (...args: any) => any> = {
  message: string
  parameters: Parameters<T>
  expected: ReturnType<T>
}

describe('subscriptions data transformations', () => {
  describe('getIsConnected', () => {
    test.each<TestCase<typeof getIsConnected>>([
      {
        message: 'no subscriptions means not connected (omitted array)',
        parameters: [undefined],
        expected: false,
      },
      {
        message: 'no subscriptions means not connected (empty array)',
        parameters: [[]],
        expected: false,
      },
      {
        message: 'last subscription without disconnect time means connected',
        parameters: [[
          {
            connectTime: '2021-07-13T09:03:11.614941842Z',
            disconnectTime: '2021-07-13T09:03:11.614941842Z',
          },
          {
            connectTime: '2021-07-13T09:03:11.614941842Z',
          },
        ]],
        expected: true,
      },
      {
        message: 'last subscription with disconnect time means not connected',
        parameters: [[
          {
            connectTime: '2021-07-13T09:03:11.614941842Z',
            disconnectTime: '2021-07-13T09:03:11.614941842Z',
          },
          {
            connectTime: '2021-07-13T09:03:11.614941842Z',
            disconnectTime: '2021-07-13T09:03:11.614941842Z',
          },
        ]],
        expected: false,
      },
    ])('$message', ({ parameters, expected }) => {
      expect(getIsConnected(...parameters)).toStrictEqual(expected)
    })
  })
})
