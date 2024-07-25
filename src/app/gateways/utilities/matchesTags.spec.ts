import { describe, expect, test } from 'vitest'

import { matchesTags } from './'

describe('matchesTags', () => {
  test.each([
    [
      'no tags ({}) + no matchers',
      {},
      [],
      true,
    ],
    [
      'tags + no matchers',
      { listener: 'test' },
      [],
      true,
    ],
    [
      'no tags + matchers',
      {},
      [{ key: 'listener', value: 'test', not: false }],
      false,
    ],
    [
      'no tags + matchers with “not”',
      {},
      [{ key: 'listener', value: 'test', not: true }],
      true,
    ],
    [
      'tags + matchers',
      { listener: 'test' },
      [{ key: 'listener', value: 'test', not: false }],
      true,
    ],
    [
      'tags + matchers with “not”',
      { listener: 'test' },
      [{ key: 'listener', value: 'test', not: true }],
      false,
    ],
    [
      'tags + matchers with mismatched key',
      { listener: 'test' },
      [{ key: 'NOPE', value: 'test', not: false }],
      false,
    ],
    [
      'tags, matchers with mismatched value',
      { listener: 'test' },
      [{ key: 'listener', value: 'NOPE', not: false }],
      false,
    ],
  ])('%s', (_message, tags, matchers, expectedResult) => {
    expect(matchesTags(tags, matchers)).toBe(expectedResult)
  })
})
