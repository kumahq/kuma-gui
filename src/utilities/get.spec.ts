import { describe, test, expect } from '@jest/globals'

import { get } from './get'

describe('get', () => {
  test.each([
    [{ a: { b: { c: 3 } } }, ['a', 'b', 'c'], undefined, 3],
    [{ a: { b: { c: 3 } } }, ['a', 'b', 'd'], undefined, undefined],
    [{ a: { b: { c: 3 } } }, 'a.b.c', 'default', 3],
    [{ a: { b: { c: 3 } } }, 'a.b.d', 'default', 'default'],
  ])('works', (obj, pathOrProps, defaultValue, expectedValue) => {
    expect(get(obj, pathOrProps, defaultValue)).toEqual(expectedValue)
  })
})
