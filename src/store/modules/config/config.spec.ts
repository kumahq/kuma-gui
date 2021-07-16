import setupStore from '@/testUtils/setupStore'
import config from '.'

describe('config module', () => {
  describe('getters', () => {
    it('tests getStatus getter', () => {
      const store = setupStore(config, { status: 'foo' })

      expect(store.getters.getStatus).toBe('foo')
    })
  })

  describe('actions', () => {
    // It will require to create a mock for request on '/'

    xit('tests getStatus action', async () => {
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
