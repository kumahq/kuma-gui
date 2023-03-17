import { describe, expect, test } from '@jest/globals'

import { useEnv } from './index'
import { withVersion } from '@/../jest/jest-setup-after-env'

describe('useEnv', () => {
  test('it works', () => {
    withVersion('100.1.1')

    const env = useEnv()
    expect(env('KUMA_VERSION')).toBe('100.1.1')
  })
})
