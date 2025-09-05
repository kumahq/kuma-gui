import { describe, expect, test } from 'vitest'

import features from '.'

describe('can', () => {
  test('works', () => {
    const can = features({
      'use enabled-feature': () => true,
      'use disabled-feature': () => false,
    })
    expect(can('use enabled-feature')).toBe(true)
    expect(can('use disabled-feature')).toBe(false)
  })
  test('converts string returns correctly', () => {
    const can = features({
      'use enabled-feature': () => 'true',
      'use disabled-feature': () => 'false',
    })
    expect(can('use enabled-feature')).toBe(true)
    expect(can('use disabled-feature')).toBe(false)
  })
  test('converts numeric returns correctly', () => {
    const can = features({
      'use enabled-feature': () => 1,
      'use disabled-feature': () => 0,
    })
    expect(can('use enabled-feature')).toBe(true)
    expect(can('use disabled-feature')).toBe(false)
  })
  test('first argument is can which can be called correctly', () => {
    const can = features({
      'use enabled-feature': (can) => !can('use disabled-feature'),
      'use disabled-feature': () => 0,
    })
    expect(can('use enabled-feature')).toBe(true)
    expect(can('use disabled-feature')).toBe(false)
  })
})
