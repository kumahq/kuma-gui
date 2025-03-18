// Importing styles here enforces a consistent stylesheet order between the Vite development server and the production build. See https://github.com/vitejs/vite/issues/4890.
import './assets/styles/main.scss'

import { services as application, TOKENS as APPLICATION } from '@/app/application'
import { services as configuration } from '@/app/configuration'
import { TOKENS } from '@/app/kuma'
import { services as serviceMesh } from '@/app/service-mesh'
import { services as vue, TOKENS as VUE } from '@/app/vue'
import { build } from '@/services/utils'

async function mountVueApplication() {
  const $ = {
    ...VUE,
    ...APPLICATION,
    ...TOKENS,
  }

  const get = build(
    vue($),

    application({
      ...$,
      routes: $.routesLabel,
    }),

    serviceMesh({
      ...$,
      routes: $.routesLabel,
    }),
    configuration({
      ...$,
      routes: $.routesLabel,
    }),

    // any DEV-time only service container configuration
    import.meta.env.MODE !== 'production'
      ? await (async () => {
        const [application, x, xdebug, kuma, msw, fakeFs] = await Promise.all([
          import('@/app/application/debug'),
          import('@/app/x'),
          import('@/app/x/debug'),
          import('@/app/kuma/debug'),
          import('@/app/msw'),
          import('@/app/fake-fs'),
        ],
        )
        const TOKENS = {
          ...$,
          ...msw.TOKENS,
          ...fakeFs.TOKENS,
          ...x.TOKENS,
        }
        return [
          ...application.services(TOKENS),
          ...xdebug.services(TOKENS),
          ...kuma.services(TOKENS),
          ...msw.services(TOKENS),
          ...fakeFs.services(TOKENS),
        ]
      })()
      : [],
  )
  if (import.meta.env.MODE !== 'production' && get($.env)('KUMA_MOCK_API_ENABLED', 'true') === 'true') {
    const msw = await import('@/app/msw')
    await get(msw.TOKENS.msw)
  }
  const app = await get($.app)((await import('./app/App.vue')).default)

  app.config.errorHandler = function (error) {
    // Patches the vue-router MATCHER_NOT_FOUND error message back into the error object because vue-router explicitly creates an `Error` object with no message in production environments.
    if (
      error instanceof Error &&
      error.message === '' &&
      'type' in error &&
      error.type === 1 &&
      'location' in error
    ) {
      // Changing `error.message` causes Vue to throw the error twice even when `errorHandler` throws the same `Error` object.
      error.message = `No match for ${JSON.stringify(error.location)}`

      throw error
    }

    throw error
  }

  app.mount('#app')
}

mountVueApplication()
