import { TOKENS as PROD_TOKENS, services as production } from '@/services/production'
import { build } from '@/services/utils'

async function mountVueApplication() {
  const get = build(
    // production service container configuration
    production(PROD_TOKENS),
    // any DEV-time only service container configuration
    import.meta.env.MODE !== 'production'
      ? await (async () => {
        const dev = await import('@/services/development')
        return dev.services({
          ...PROD_TOKENS,
          ...dev.TOKENS,
        })
      })()
      : [],
  )

  const app = await get(PROD_TOKENS.app)((await import('./app/App.vue')).default)
  app.mount('#app')

  const store = get(PROD_TOKENS.store)
  await store.dispatch('updateGlobalLoading', true)
  const bootstrap = get(PROD_TOKENS.bootstrap)
  await bootstrap()
  await store.dispatch('updateGlobalLoading', false)
}

mountVueApplication()
