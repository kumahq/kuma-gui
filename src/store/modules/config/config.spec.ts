import { rest } from 'msw'

import configModule from './config'
import { server } from '@/../jest/jest-setup-after-env'
import { kumaApi } from '@/api/kumaApi'

describe('config module', () => {
  describe('getters', () => {
    it('tests getStatus getter', () => {
      const state: any = {
        status: 'foo',
      }

      const result = configModule.getters.getStatus(state, {}, {} as any, {})

      expect(result).toBe('foo')
    })

    it('tests getMulticlusterStatus getter when global mode', () => {
      const getters = {
        getMode: 'global',
      }

      const result = configModule.getters.getMulticlusterStatus({} as any, getters, {} as any, {})

      expect(result).toBe(true)
    })

    it('tests getMulticlusterStatus getter when standalone', () => {
      const getters = {
        getMode: 'standalone',
      }

      const result = configModule.getters.getMulticlusterStatus({} as any, getters, {} as any, {})

      expect(result).toBe(false)
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      jest.restoreAllMocks()
    })

    it('tests getStatus action', async () => {
      server.use(rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL, (req, res, ctx) => res(ctx.status(200))))

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

    it.each([
      [
        {
          tagline: 'Other',
          version: '0.0.0-preview.abcd1234',
          basedOnKuma: '0.0.0-preview.abcd1234',
          hostname: '',
          instanceId: '',
          clusterId: '',
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
          hostname: '',
          instanceId: '',
          clusterId: '',
        },
        {
          tagline: 'Other',
          version: '1.6.0-preview.abcd1234',
          kumaDocsVersion: '1.6.x',
        },
      ],
      [
        {
          tagline: import.meta.env.VITE_NAMESPACE,
          version: '1.5.3',
          basedOnKuma: '1.5.1',
          hostname: '',
          instanceId: '',
          clusterId: '',
        },
        {
          tagline: import.meta.env.VITE_NAMESPACE,
          version: '1.5.3',
          kumaDocsVersion: '1.5.x',
        },
      ],
      [
        {
          tagline: import.meta.env.VITE_NAMESPACE,
          version: '1.5.3',
          hostname: '',
          instanceId: '',
          clusterId: '',
        },
        {
          tagline: import.meta.env.VITE_NAMESPACE,
          version: '1.5.3',
          kumaDocsVersion: '1.5.x',
        },
      ],
    ])('tests getInfo action', async (getInfoResponse, expectedState) => {
      jest.spyOn(kumaApi, 'getInfo').mockImplementation(() => Promise.resolve(getInfoResponse))

      const state: any = {
        tagline: null,
        version: null,
        kumaDocsVersion: null,
      }

      function commit(type: string, status: any): void {
        configModule.mutations[type](state, status)
      }

      // @ts-ignore I can’t be bothered to battle Vuex’s loose types right now.
      await configModule.actions.getInfo({ commit })

      expect(state.tagline).toBe(expectedState.tagline)
      expect(state.version).toBe(expectedState.version)
      expect(state.kumaDocsVersion).toBe(expectedState.kumaDocsVersion)
    })
  })

  describe('mutations', () => {
    it('tests SET_CONFIG_DATA mutation', () => {
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
