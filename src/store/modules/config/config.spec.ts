import { rest } from 'msw'
import config from '.'
import { server } from '@/jest-setup'
import setupStore from '@/testUtils/setupStore'
import Kuma from '@/services/kuma'

describe('config module', () => {
  describe('getters', () => {
    it('tests getStatus getter', () => {
      const store = setupStore(config, { status: 'foo' })

      expect(store.getters.getStatus).toBe('foo')
    })

    it('tests getMulticlusterStatus getter when global mode', () => {
      const store = setupStore(config, { clientConfig: { mode: 'global' } })

      expect(store.getters.getMulticlusterStatus).toBe(true)
    })

    it('tests getMulticlusterStatus getter when standalone', () => {
      const store = setupStore(config, { clientConfig: { mode: 'standalone' } })

      expect(store.getters.getMulticlusterStatus).toBe(false)
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      jest.restoreAllMocks()
    })

    it('tests getStatus action', async () => {
      server.use(rest.get('http://localhost/', (req, res, ctx) => res(ctx.status(200))))
      const store = setupStore(config)

      await store.dispatch('getStatus')

      expect(store.getters.getStatus).toBe('OK')
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
        }
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
        }
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
        }
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
        }
      ],
    ])('tests getInfo action', async (getInfoResponse, expectedState) => {
      jest.spyOn(Kuma, 'getInfo').mockImplementation(() => Promise.resolve(getInfoResponse))

      const store = setupStore(config)

      await store.dispatch('getInfo')

      expect(store.state.tagline).toBe(expectedState.tagline)
      expect(store.state.version).toBe(expectedState.version)
      expect(store.state.kumaDocsVersion).toBe(expectedState.kumaDocsVersion)
    })
  })

  describe('mutations', () => {
    it('tests SET_CONFIG_DATA mutation', () => {
      const store = setupStore(config)

      const userConfig = { foo: 'bar' }

      store.commit('SET_CONFIG_DATA', userConfig)

      expect(store.getters.getConfig).toBe(userConfig)
    })
  })
})
