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
  test('allows multiple arguments to provide additional data as context', () => {
    const can = features({
      // @ts-expect-error -- need to allow in TS to pass extra arguments
      'use enabled-feature': (_can, context: { enabled: boolean }) => context.enabled,
      // @ts-expect-error -- need to allow in TS to pass extra arguments
      'use disabled-feature': (can, context: { enabled: boolean }) => !can('use enabled-feature', context),
    })
    // @ts-expect-error -- need to allow in TS to pass extra arguments
    expect(can('use enabled-feature', { enabled: true })).toBe(true)
    // @ts-expect-error -- need to allow in TS to pass extra arguments
    expect(can('use disabled-feature', { enabled: true })).toBe(false)
  })})
