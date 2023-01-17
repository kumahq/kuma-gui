import { describe, expect, test } from '@jest/globals'

import { semver } from './env'

describe('env', () => {
  describe('semver', () => {
    test('it works', () => {
      expect(semver('1.1.1').patch).toBe('1.1.1')
      expect(semver('0.0.0-preview.1').patch).toBe('0.0.0')
      expect(semver('0.0.1-rc.1').patch).toBe('0.0.1')
      expect(semver('10.10.1').major).toBe('10')
      expect(semver('0.9.1').minor).toBe('0.9')
      expect(semver('0.9.1-rc.10').pre).toBe('0.9.1-rc.10')
    })
  })
})
