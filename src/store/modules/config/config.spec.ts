import { createStore } from 'vuex'
import { rest } from 'msw'

import { storeConfig, State } from '../../index'
import { server } from '@/jest-setup'
import Kuma from '@/services/kuma'

const store = createStore<State>(storeConfig)

describe('config module', () => {
  describe('getters', () => {
    it('tests getStatus getter', () => {
      // @ts-expect-error because Vuex `createStore`’s return value is missing module state from its type.
      store.state.config.status = 'foo'

      expect(store.getters['config/getStatus']).toBe('foo')
    })

    it('tests getMulticlusterStatus getter when global mode', () => {
      // @ts-expect-error because Vuex `createStore`’s return value is missing module state from its type.
      store.state.config.clientConfig = { mode: 'global' }

      expect(store.getters['config/getMulticlusterStatus']).toBe(true)
    })

    it('tests getMulticlusterStatus getter when standalone', () => {
      // @ts-expect-error because Vuex `createStore`’s return value is missing module state from its type.
      store.state.config.clientConfig = { mode: 'standalone' }

      expect(store.getters['config/getMulticlusterStatus']).toBe(false)
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      jest.restoreAllMocks()
    })

    it('tests getStatus action', async () => {
      server.use(rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL, (req, res, ctx) => res(ctx.status(200))))

      await store.dispatch('config/getStatus')

      expect(store.getters['config/getStatus']).toBe('OK')
    })

    it.each([
      [
        {
          tagline: 'Other',
          version: '0.0.0-preview.abcd1234',
          basedOnKuma: '0.0.0-preview.abcd1234',
        },
        {
          tagline: 'Other',
          version: '0.0.0-preview.abcd1234',
          kumaDocsVersion: 'dev',
        },
      ],
      [
        {
          tagline: 'Other',
          version: '1.6.0-preview.abcd1234',
          basedOnKuma: '1.6.0-preview.abcd1234',
        },
        {
          tagline: 'Other',
          version: '1.6.0-preview.abcd1234',
          kumaDocsVersion: '1.6.0',
        },
      ],
      [
        {
          tagline: 'Kuma',
          version: '1.5.3',
          basedOnKuma: '1.5.1',
        },
        {
          tagline: 'Kuma',
          version: '1.5.3',
          kumaDocsVersion: '1.5.1',
        },
      ],
      [
        {
          tagline: 'Kuma',
          version: '1.5.3',
        },
        {
          tagline: 'Kuma',
          version: '1.5.3',
          kumaDocsVersion: 'latest',
        },
      ],
    ])('tests getInfo action', async (getInfoResponse, expectedState) => {
      jest.spyOn(Kuma, 'getInfo').mockImplementation(() => Promise.resolve(getInfoResponse))

      await store.dispatch('config/getInfo')

      expect(store.state.config?.tagline).toBe(expectedState.tagline)
      expect(store.state.config?.version).toBe(expectedState.version)
      expect(store.state.config?.kumaDocsVersion).toBe(expectedState.kumaDocsVersion)
    })
  })

  describe('mutations', () => {
    it('tests SET_CONFIG_DATA mutation', () => {
      const userConfig = { foo: 'bar' }

      store.commit('config/SET_CONFIG_DATA', userConfig)

      expect(store.getters['config/getConfig']).toEqual(userConfig)
    })
  })
})
