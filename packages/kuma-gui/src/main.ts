// Importing styles here enforces a consistent stylesheet order between the Vite development server and the production build. See https://github.com/vitejs/vite/issues/4890.
import './assets/styles/main.scss'

import { createBuilder } from '@kumahq/container'
import { createApp } from 'vue'

import { services as application, TOKENS as APPLICATION } from '@/app/application'
import { services as configuration } from '@/app/configuration'
import { services as controlPlanes } from '@/app/control-planes'
import { services as dataplanes } from '@/app/data-planes'
import { services as gateways } from '@/app/gateways'
import { services as hostnameGenerators } from '@/app/hostname-generators'
import { services as kuma, TOKENS as KUMA } from '@/app/kuma'
import { services as legacyDataplanes } from '@/app/legacy-data-planes'
import { services as me } from '@/app/me'
import { services as meshIdentities } from '@/app/mesh-identities'
import { services as meshTrusts } from '@/app/mesh-trusts'
import { services as meshes } from '@/app/meshes'
import { services as policies } from '@/app/policies'
import { services as resources } from '@/app/resources'
import { services as rules } from '@/app/rules'
import { services as services } from '@/app/services'
import { services as vue, TOKENS as VUE } from '@/app/vue'
import { services as workloads } from '@/app/workloads'
import { services as zoneEgresses } from '@/app/zone-egresses'
import { services as zoneIngresses } from '@/app/zone-ingresses'
import { services as zones } from '@/app/zones'

async function mountVueApplication() {
  const $ = {
    ...VUE,
    ...APPLICATION,
    ...KUMA,
  }

  const { build, injectionKey } = createBuilder()
  const get = build(
    vue($),
    application($),
    me($),
    //
    kuma($),

    configuration($),
    controlPlanes($),
    zones($),
    zoneEgresses($),
    zoneIngresses($),
    meshes($),
    hostnameGenerators($),
    services($),
    gateways($),
    dataplanes($),
    legacyDataplanes($),
    workloads($),
    policies($),
    resources($),
    rules($),
    meshIdentities($),
    meshTrusts($),
    //

    // any DEV-time only service container configuration
    import.meta.env.MODE !== 'production'
      ? await (async () => {
        const [application, kuma, msw, fakeFs, meshes] = await Promise.all([
          import('@/app/application/debug'),
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

  // The legacy services module is opt-in. It is conditionally lazy loaded and
  // registered with the container when `KUMA_LEGACY_SERVICES_ENABLED` is enabled
  // We can only make this decision once the container exists, because `env`, like every other
  // service, lives in the container. Resolving `$.env` after the initial build.
  // A second build registers the module into the same container
  // before routes/sources are resolved at mount time.
  if (get($.env)('KUMA_LEGACY_SERVICES_ENABLED') === 'true') {
    const { services: legacyServices } = await import('@/app/legacy-services/index.ts')
    build(legacyServices($))
  }
  const app = createApp((await import('./app/App.vue')).default)
  app.provide(injectionKey, get)
  ;(await get($.app)(app)).mount('#app')
}

mountVueApplication()
