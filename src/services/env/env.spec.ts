import { describe, expect, test } from 'vitest'

import Env, { normalizeBaseUrl, semver } from './Env'

describe('env', () => {
  test('semver', () => {
    expect(semver('1.1.1').patch).toBe('1.1.1')
    expect(semver('0.0.0-preview.1').patch).toBe('0.0.0')
    expect(semver('0.0.1-rc.1').patch).toBe('0.0.1')
    expect(semver('10.10.1').major).toBe('10')
    expect(semver('0.9.1').minor).toBe('0.9')
    expect(semver('0.9.1-rc.10').pre).toBe('0.9.1-rc.10')
  })

  test('var', () => {
    class MockEnv extends Env {
      protected getConfig() {
        return {
          baseGuiPath: '/not/gui',
          apiUrl: '/somewhere/else',
          version: '110.127.30',
          product: 'Kuma',
          mode: 'standalone',
          environment: 'universal',
          storeType: 'postgres',
          apiReadOnly: false,
        }
      }
    }
    const env = new MockEnv(
      {
        KUMA_PRODUCT_NAME: 'product',
        KUMA_FEEDBACK_URL: 'http://feedback.fake',
        KUMA_CHAT_URL: 'http://chat.fake',
        KUMA_INSTALL_URL: 'http://install.fake',
        KUMA_VERSION_URL: 'http://version.fake',
        KUMA_DOCS_URL: 'http://docs.fake',
        KUMA_MOCK_API_ENABLED: 'false',
        KUMA_ZONE_CREATION_FLOW: 'enabled',
      },
    )
    expect(env.var('KUMA_DOCS_URL')).toBe('http://docs.fake/110.127.x')
    expect(env.var('KUMA_INSTALL_URL')).toBe('http://install.fake?utm_source=product&utm_medium=product')
    expect(env.var('KUMA_VERSION')).toBe('110.127.30')
    expect(env.var('KUMA_API_URL')).toBe('/somewhere/else')
    expect(env.var('KUMA_BASE_PATH')).toBe('/not/gui')
    expect(env.var('KUMA_PRODUCT_NAME')).toBe('product')
    expect(env.var('KUMA_FEEDBACK_URL')).toBe('http://feedback.fake')
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
