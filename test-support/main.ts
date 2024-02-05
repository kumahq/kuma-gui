// This is the `main`/entrypoint for our CLI unit tests
// When running via vitest this file is added first using
// vitest's `setupFiles` property, please see `/vite.config.production.ts`

import { beforeEach, afterEach } from 'vitest'

import { services as testing } from './index'
import { TOKENS as $, services as production } from '@/services/production'
import { get, container, build } from '@/services/utils'

(async () => {
  build(
    production($),
    testing($),
  )
  // initializes vue-test-utils with any global components and/or plugins etc
  get($.app)
  beforeEach(() => container.capture?.())
  afterEach(() => container.restore?.())
})()
