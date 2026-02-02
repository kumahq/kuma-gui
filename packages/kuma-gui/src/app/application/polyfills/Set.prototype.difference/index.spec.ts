import { describe, expect, test } from 'vitest'

import { difference } from '.'

describe('Set.prototype.difference', () => {
  test('difference.getPolyfill', () => {
    // @ts-expect-error - explicitly delete for testing
    delete Set.prototype.difference
    expect(Set.prototype.difference).toBeUndefined()
    difference.getPolyfill()
    expect(typeof Set.prototype.difference).toBe('function')
    expect(new Set().difference(new Set())).toBeInstanceOf(Set)
    expect(new Set([1, 2, 3]).difference(new Set([2, 3, 4]))).toEqual(new Set([1]))
    expect(new Set(['a', 'b', 'c']).difference(new Set(['b']))).toEqual(new Set(['a', 'c']))
  })
})
