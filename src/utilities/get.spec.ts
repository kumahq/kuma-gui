import { describe, expect, test } from 'vitest'

import { get } from './get'

describe('get', () => {
  test.each([
    [{ a: { b: { c: 3 } } }, ['a', 'b', 'c'], undefined, 3],
    [{ a: { b: { c: 3 } } }, ['a', 'b', 'd'], undefined, undefined],
    [{ a: { b: { c: 3 } } }, 'a.b.c', 'default', 3],
    [{ a: { b: { c: null } } }, 'a.b.c', 'default', null],
    [{ a: { b: { c: undefined } } }, 'a.b.c', 'default', undefined],
    [{ a: { b: { c: 3 } } }, 'a.b.d', 'default', 'default'],
    [{ a: { b: ['c', 'd'] } }, 'a.b[1]', undefined, 'd'],
    [{ a: { b: ['c', 'd'] } }, ['a', 'b', '1'], undefined, 'd'],
    [{ a: { b: ['c', { nested: 'd' }] } }, ['a', 'b', '1', 'nested'], undefined, 'd'],
    [['a', 'b', 'c'], '1', undefined, 'b'],
    [['a', 'b', 'c'], '[1]', undefined, 'b'],
    [{ labels: { key: 'value' } }, 'labels["key"]', undefined, 'value'],
    [{ labels: { key: 'value' } }, "labels['key']", undefined, 'value'],
    [{ labels: { key: { nestedKey: 'nestedValue' } } }, 'labels["key"]["nestedKey"]', undefined, 'nestedValue'],
  ])('works', (obj, pathOrProps, defaultValue, expectedValue) => {
    expect(get(obj, pathOrProps, defaultValue)).toEqual(expectedValue)
  })
})
