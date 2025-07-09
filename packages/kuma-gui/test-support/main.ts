// This is the `main`/entrypoint for our CLI unit tests
// When running via vitest this file is added first using
// vitest's `setupFiles` property, please see `/vite.config.production.ts`

import { get, container, build } from '@kumahq/container'
import { beforeEach, afterEach } from 'vitest'

import { services as testing } from './index'
import { services as application, TOKENS as APPLICATION } from '@/app/application'
import { TOKENS } from '@/app/kuma'
import { services as vue, TOKENS as VUE } from '@/app/vue'

(async () => {
  const $ = {
    ...VUE,
    ...APPLICATION,
    ...TOKENS,
  }
  build(
    vue($),

    application({
      ...$,
      routes: $.routesLabel,
    }),

    testing($),
  )
  // initializes vue-test-utils with any global components and/or plugins etc
  get($.app)
  beforeEach(() => container.capture?.())
  afterEach(() => container.restore?.())
})()
