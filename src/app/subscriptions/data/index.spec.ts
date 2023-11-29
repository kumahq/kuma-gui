import { describe, expect, test } from 'vitest'

import { getStatus } from './index'

type TestCase<T extends (...args: any) => any> = {
  message: string
  parameters: Parameters<T>
  expected: ReturnType<T>
}

describe('subscriptions data transformations', () => {
  describe('getStatus', () => {
    test.each<TestCase<typeof getStatus>>([
      {
        message: 'no subscriptions means not connected, yet, i.e. offline (omitted array)',
        parameters: [undefined],
        expected: 'offline',
      },
      {
        message: 'no subscriptions means not connected, yet, i.e. offline (empty array)',
        parameters: [[]],
        expected: 'offline',
      },
      {
        message: 'last subscription without disconnect time means offline',
        parameters: [[
          {
            connectTime: '2021-07-13T09:03:11.614941842Z',
            disconnectTime: '2021-07-13T09:03:11.614941842Z',
          },
          {
            connectTime: '2021-07-13T09:03:11.614941842Z',
          },
        ]],
        expected: 'online',
      },
      {
        message: 'last subscription with disconnect time means offline',
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
        expected: 'offline',
      },
    ])('$message', ({ parameters, expected }) => {
      expect(getStatus(...parameters)).toStrictEqual(expected)
    })
  })
})
