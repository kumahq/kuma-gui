import { TOKENS as $, services as production } from '@/services/production'
import { build } from '@/services/utils'

async function mountVueApplication() {
  const get = build(
    // production service container configuration
    production($),
    // any DEV-time only service container configuration
    import.meta.env.MODE !== 'production'
      ? await (async () => {
        const dev = await import('@/services/development')
        return dev.services({
          ...$,
          ...dev.TOKENS,
        })
      })()
      : [],
  )

  const app = await get($.app)((await import('./app/App.vue')).default)

  await get($.bootstrap)()
  app.mount('#app')
}

mountVueApplication()
