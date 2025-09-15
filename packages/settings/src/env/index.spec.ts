import { describe, expect, test } from 'vitest'

import vars from './'

describe('env', () => {
  test('works', () => {
    const env = vars({
      'ENV_VAR': () => 'http://kumahq.io',
    })
    expect(env('ENV_VAR')).toBe('http://kumahq.io')
  })
  test('converts string returns correctly', () => {
    const env = vars({
      'ENV_VAR_BOOLEAN': () => true,
    })
    expect(env('ENV_VAR_BOOLEAN')).toBe('true')
  })
  test('first argument is env which can be called correctly', () => {
    const env = vars({
      'ENV_VAR': (env) => env('ENV_VAR_NUMBER'),
      'ENV_VAR_NUMBER': () => 1,
    })
    expect(env('ENV_VAR')).toBe('1')
  })
})
