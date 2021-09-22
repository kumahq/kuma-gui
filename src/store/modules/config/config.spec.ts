import { rest } from 'msw'
import { server } from '@/jest-setup'
import setupStore from '@/testUtils/setupStore'
import config from '.'

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
    it('tests getStatus action', async () => {
      server.use(rest.get('http://localhost/', (req, res, ctx) => res(ctx.status(200))))
      const store = setupStore(config)

      await store.dispatch('getStatus')

      expect(store.getters.getStatus).toBe('OK')
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
