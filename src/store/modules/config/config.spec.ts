import { beforeEach, describe, expect, jest, test } from '@jest/globals'

import _configModule from './config'
import { get, TOKENS } from '@/services'
const configModule = _configModule(get(TOKENS.api))

describe('config module', () => {
  describe('getters', () => {
    test('tests getStatus getter', () => {
      const state: any = {
        status: 'foo',
      }

      const result = configModule.getters.getStatus(state, {}, {} as any, {})

      expect(result).toBe('foo')
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      jest.restoreAllMocks()
    })

    test('tests getStatus action', async () => {
      const state: any = {
        status: null,
      }

      function commit(type: string, status: any): void {
        configModule.mutations[type](state, status)
      }

      // @ts-ignore I can’t be bothered to battle Vuex’s loose types right now.
      await configModule.actions.getStatus({ commit })
      const result = configModule.getters.getStatus(state, {}, {} as any, {})

      expect(result).toBe('OK')
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
