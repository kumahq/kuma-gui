// Importing styles here enforces a consistent stylesheet order between the Vite development server and the production build. See https://github.com/vitejs/vite/issues/4890.
import './assets/styles/main.scss'

import { services as controlPlanes, TOKENS as CONTROL_PLANES_TOKENS } from '@/app/control-planes'
import { services as diagnostics } from '@/app/diagnostics'
import { services as onboarding } from '@/app/onboarding'
import { TOKENS as $, services as production } from '@/services/production'
import { build } from '@/services/utils'

async function mountVueApplication() {
  const get = build(
    // production service container configuration
    production($),

    controlPlanes({
      ...$,
      routes: $.routesLabel,
    }),
    onboarding({
      ...$,
      ControlPlaneStatus: CONTROL_PLANES_TOKENS.ControlPlaneStatus,
      routes: $.routesLabel,
    }),
    diagnostics({
      ...$,
      routes: $.routesLabel,
    }),
    // any DEV-time only service container configuration
    import.meta.env.MODE !== 'production'
      ? await (async () => {
        const [msw, dev] = await Promise.all([
          import('@/app/msw'),
          import('@/services/development'),
        ],
        )
        const TOKENS = {
          ...$,
          ...msw.TOKENS,
          ...dev.TOKENS,
        }
        return [
          ...msw.services(TOKENS),
          ...dev.services(TOKENS),
        ]
      })()
      : [],
  )

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
