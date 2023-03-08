import { describe, expect, test } from '@jest/globals'

import { useEnv } from './index'
import { container, TOKENS, service, injected } from '@/services'
import Env from '@/services/env/Env'

describe('useEnv', () => {
  test('it works', () => {
    container.capture?.()

    class TestEnv extends Env {
      var(...rest: Parameters<Env['var']>) {
        const key = rest[0]
        if (key === 'KUMA_VERSION') {
          return '100.1.1'
        }
        return super.var(...rest)
      }
    }
    TOKENS.Env = service(TestEnv, { description: 'Env' })
    injected(TestEnv, TOKENS.EnvVars)

    const env = useEnv()
    expect(env('KUMA_VERSION')).toBe('100.1.1')
    container.restore?.()
  })
})
