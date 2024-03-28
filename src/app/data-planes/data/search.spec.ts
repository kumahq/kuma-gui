import { describe, expect, test } from 'vitest'

import { DataplaneOverview } from '.'
describe('DataplaneOverview.search', () => {
  test.each([
    [
      'service:service-name',
      {
        tag: ['kuma.io/service:service-name'],
      },
    ],
    [
      'service:service-name version:1',
      {
        tag: [
          'kuma.io/service:service-name',
          'version:1',
        ],
      },
    ],
    [
      'service:service-name name:service-name',
      {
        name: 'service-name',
        tag: [
          'kuma.io/service:service-name',
        ],
      },
    ],
    [
      'service:service-name name:service-name zone:zone-name',
      {
        name: 'service-name',
        tag: [
          'kuma.io/service:service-name',
          'kuma.io/zone:zone-name',
        ],
      },
    ],
    [
      'service:service-name name:service-name zone:zone-name tag:version:1',
      {
        name: 'service-name',
        tag: [
          'kuma.io/service:service-name',
          'kuma.io/zone:zone-name',
          'version:1',
        ],
      },
    ],
    // key only tags
    [
      'service:service-name name:service-name zone:zone-name tag:version',
      {
        name: 'service-name',
        tag: [
          'kuma.io/service:service-name',
          'kuma.io/zone:zone-name',
          'version',
        ],
      },
    ],
    // shortcut and long form together
    [
      'service:service-name name:service-name zone:zone-name tag:version kuma.io/service:something-else',
      {
        name: 'service-name',
        tag: [
          'kuma.io/service:service-name',
          'kuma.io/zone:zone-name',
          'version',
          'kuma.io/service:something-else',
        ],
      },
    ],
  ])('%s works', (search, expected) => {
    const actual = DataplaneOverview.search(search)
    expect(actual).toStrictEqual(expected)
  })
})
