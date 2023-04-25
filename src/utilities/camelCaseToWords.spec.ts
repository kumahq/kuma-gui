import { describe, test, expect } from '@jest/globals'

import { camelCaseToWords } from './camelCaseToWords'

describe('camelCaseToWords', () => {
  test.each([
    ['', ''],
    ['a', 'A'],
    ['camelCase', 'Camel Case'],
    ['XMLHttpRequest', 'XML Http Request'],
    ['Connect time', 'Connect time'],
    [' a b c d e f g ID ', 'A b c d e f g ID'],
  ])('works', (string, expectedString) => {
    expect(camelCaseToWords(string)).toBe(expectedString)
  })
})
