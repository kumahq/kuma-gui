// Importing styles here enforces a consistent stylesheet order between the Vite development server and the production build. See https://github.com/vitejs/vite/issues/4890.
import './assets/styles/main.scss'

import { createBuilder } from '@kumahq/container'
import { createApp } from 'vue'

import { services as application, TOKENS as APPLICATION } from '@/app/application'
import { services as configuration } from '@/app/configuration'
import { services as dataplanes } from '@/app/data-planes'
import { services as externalServices } from '@/app/external-services'
import { services as gateways } from '@/app/gateways'
import { TOKENS } from '@/app/kuma'
import { services as legacyDataplanes } from '@/app/legacy-data-planes'
import { services as meshIdentities } from '@/app/mesh-identities'
import { services as meshTrusts } from '@/app/mesh-trusts'
import { services as policies } from '@/app/policies'
import { services as resources } from '@/app/resources'
import { services as rules } from '@/app/rules'
import { services as serviceMesh } from '@/app/service-mesh'
import { services as services } from '@/app/services'
import { services as vue, TOKENS as VUE } from '@/app/vue'
import { services as workloads } from '@/app/workloads'

async function mountVueApplication() {
  const $ = {
    ...VUE,
    ...APPLICATION,
    ...TOKENS,
  }

  const { build, injectionKey } = createBuilder()
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
    services($),
    externalServices($),
    gateways($),
    dataplanes($),
    legacyDataplanes($),
    workloads($),
    policies($),
    resources($),
    rules($),
    meshIdentities($),
    meshTrusts($),

    // any DEV-time only service container configuration
    import.meta.env.MODE !== 'production'
      ? await (async () => {
        const [application, serviceMeshDebug, kuma, msw, fakeFs, meshes] = await Promise.all([
          import('@/app/application/debug'),
          import('@/app/service-mesh/debug'),
          import('@/app/kuma/debug'),
          import('@/app/msw'),
          import('@/app/fake-fs'),
          import('@/app/meshes/debug'),
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
          ...kuma.locales(TOKENS),
          ...msw.services(TOKENS),
          ...fakeFs.services(TOKENS),
          ...meshes.services(TOKENS),
        ]
      })()
      : [],
  )
  // @ts-ignore KUMA_MOCK_API_ENABLED non-prod only
  if (import.meta.env.MODE !== 'production' && get($.env)('KUMA_MOCK_API_ENABLED') === 'true') {
    const msw = await import('@/app/msw')
    await get(msw.TOKENS.msw)
  }
  const app = createApp((await import('./app/App.vue')).default)
  app.provide(injectionKey, get)
  ;(await get($.app)(app)).mount('#app')
}

mountVueApplication()
