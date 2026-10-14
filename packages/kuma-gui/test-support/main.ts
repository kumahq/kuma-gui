// This is the `main`/entrypoint for our CLI unit tests
// When running via vitest this file is added first using
// vitest's `setupFiles` property, please see `/vite.config.production.ts`

import { defaultKumaHtmlVars as htmlVars } from '@kumahq/config/vite'
import { createBuilder } from '@kumahq/container'
import { beforeEach, afterEach } from 'vitest'

import { services as application, TOKENS as APPLICATION } from '@/app/application'
import { services as kuma, TOKENS as KUMA } from '@/app/kuma'
import { services as vue, TOKENS as VUE } from '@/app/vue'
import { services as testing } from '@/app/vue/testing'
(async () => {
  const $ = {
    ...VUE,
    ...APPLICATION,
    ...KUMA,
  }
  const { build, container } = createBuilder()
  const get = build(
    application($),
    vue($),
    testing($),
    //
    kuma($),
    // during testing we don't have access to the index.html vars
    // so we inject them here so they are available during unit testing
    [
      [$.htmlVars, {
        service: () => htmlVars,
      }],
    ],
  )
  // initializes vue-test-utils with any global components and/or plugins etc
  get($.app)
  beforeEach(() => container.capture?.())
  afterEach(() => container.restore?.())
})()
