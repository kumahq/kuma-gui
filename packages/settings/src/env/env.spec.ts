import { describe, expect, test } from 'vitest'

import { Env, normalizeBaseUrl } from './Env'

describe('env', () => {
  test('var', () => {
    class MockEnv extends Env {
      protected getConfig() {
        return {
          baseGuiPath: '/not/gui',
          apiUrl: '/somewhere/else',
          version: '110.127.30',
          product: 'Kuma',
          mode: 'zone',
          environment: 'universal',
          storeType: 'postgres',
          apiReadOnly: false,
        }
      }
    }
    const env = new MockEnv(
      {
        KUMA_VERSION_URL: 'http://version.fake',
        KUMA_MOCK_API_ENABLED: 'false',
      },
    )
    expect(env.var('KUMA_VERSION')).toBe('110.127.30')
    expect(env.var('KUMA_API_URL')).toBe('/somewhere/else')
    expect(env.var('KUMA_BASE_PATH')).toBe('/not/gui')
  })

  test.each([
    ['', ''],
    ['api', '/api'],
    ['/', ''],
    ['//', ''],
    ['/api', '/api'],
    ['/api/', '/api'],
    ['http://example.org', 'http://example.org'],
    ['http://example.org/', 'http://example.org'],
    ['http://example.org/api', 'http://example.org/api'],
    ['http://example.org/api/', 'http://example.org/api'],
    ['/http/', '/http'],
    ['http://example.org/http/', 'http://example.org/http'],
    ['https://example.org/http/', 'https://example.org/http'],
    ['https://example.org////', 'https://example.org'],
  ])('normalizeBaseUrl \'%s\' > \'%s\'', (url: string, expected: string) => {
    expect(normalizeBaseUrl(url)).toBe(expected)
  })
})
