import { afterEach, describe, expect, test } from '@jest/globals'
import Env, { semver } from './Env'

describe('env', () => {
  afterEach(() => {
    document.head.innerHTML = ''
  })

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
          apiUrl: '/somewhere/else/',
          version: '110.127.30',
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
        KUMA_API_URL: '/somewhere/else/',
      },
    )
    expect(env.var('KUMA_DOCS_URL')).toBe('http://docs.fake/110.127.x')
    expect(env.var('KUMA_INSTALL_URL')).toBe('http://install.fake?utm_source=product&utm_medium=product')
    expect(env.var('KUMA_VERSION')).toBe('110.127.30')
    expect(env.var('KUMA_API_URL')).toBe('/somewhere/else/')
    expect(env.var('KUMA_BASE_PATH')).toBe('/not/gui')
    expect(env.var('KUMA_PRODUCT_NAME')).toBe('product')
    expect(env.var('KUMA_FEEDBACK_URL')).toBe('http://feedback.fake')
  })

  test.each([
    ['/', 'http://localhost'],
    ['/api', 'http://localhost/api'],
    ['/api/', 'http://localhost/api'],
    ['http://example.org', 'http://example.org'],
    ['http://example.org/', 'http://example.org'],
    ['http://example.org/api', 'http://example.org/api'],
    ['http://example.org/api/', 'http://example.org/api'],
  ])('reading apiUrl constructs correct absolute URLs', (apiUrl, expectedApiUrl) => {
    const config = { apiUrl }

    document.head.insertAdjacentHTML('beforeend', `<script type="application/json" id="kuma-config">${JSON.stringify(config)}</script>`)

    const env = new Env({
      KUMA_PRODUCT_NAME: 'product',
      KUMA_FEEDBACK_URL: 'http://feedback.fake',
      KUMA_CHAT_URL: 'http://chat.fake',
      KUMA_INSTALL_URL: 'http://install.fake',
      KUMA_VERSION_URL: 'http://version.fake',
      KUMA_DOCS_URL: 'http://docs.fake',
      KUMA_API_URL: '',
    })

    expect(env.var('KUMA_API_URL')).toBe(expectedApiUrl)
  })
})
