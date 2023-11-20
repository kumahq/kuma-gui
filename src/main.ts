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
        const dev = await import('@/services/development')
        return dev.services({
          ...$,
          ...dev.TOKENS,
        })
      })()
      : [],
  )

  const app = await get($.app)((await import('./app/App.vue')).default)
  app.mount('#app')
}

mountVueApplication()
