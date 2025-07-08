// Importing styles here enforces a consistent stylesheet order between the Vite development server and the production build. See https://github.com/vitejs/vite/issues/4890.
import './assets/styles/main.scss'

import { build } from '@kumahq/kontainer'
import { createApp } from 'vue'

import { services as application, TOKENS as APPLICATION } from '@/app/application'
import { services as configuration } from '@/app/configuration'
import { TOKENS } from '@/app/kuma'
import { services as serviceMesh } from '@/app/service-mesh'
import { services as vue, TOKENS as VUE } from '@/app/vue'

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
        const [application, serviceMeshDebug, kuma, msw, fakeFs] = await Promise.all([
          import('@/app/application/debug'),
          import('@/app/service-mesh/debug'),
          import('@/app/kuma/debug'),
          import('@/app/msw'),
          import('@/app/fake-fs'),
        ],
        )
        const TOKENS = {
          ...$,
          ...msw.TOKENS,
          ...fakeFs.TOKENS,
        }
        return [
          ...application.services(TOKENS),
          ...serviceMeshDebug.services(TOKENS),
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
  const app = createApp((await import('./app/App.vue')).default);
  (await get($.app)(app)).mount('#app')
}

mountVueApplication()
