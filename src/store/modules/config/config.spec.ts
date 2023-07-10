import { describe, expect, test } from '@jest/globals'

import _configModule from './config'
import { get, TOKENS } from '@/services'
const configModule = _configModule(get(TOKENS.api))

describe('config module', () => {
  describe('getters', () => {
    test('tests getMulticlusterStatus getter when global mode', () => {
      const getters = {
        getMode: 'global',
      }

      const result = configModule.getters.getMulticlusterStatus({} as any, getters, {} as any, {})

      expect(result).toBe(true)
    })

    test('tests getMulticlusterStatus getter when standalone', () => {
      const getters = {
        getMode: 'standalone',
      }

      const result = configModule.getters.getMulticlusterStatus({} as any, getters, {} as any, {})

      expect(result).toBe(false)
    })
  })

  describe('mutations', () => {
    test('tests SET_CONFIG_DATA mutation', () => {
      const userConfig = { foo: 'bar' }

      const state: any = {
        clientConfig: null,
      }

      configModule.mutations.SET_CONFIG_DATA(state, userConfig)

      const result = configModule.getters.getConfig(state, {}, {} as any, {})

      expect(result).toEqual(userConfig)
    })
  })
})
