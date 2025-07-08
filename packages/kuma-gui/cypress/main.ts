import { setupSteps } from '@kumahq/config/cypress/steps'
import { build, token } from '@kumahq/kontainer'

import { TOKENS, services as e2e } from './services'
import { services as application } from '@/app/application/debug'
import { TOKENS as FAKE_FS, services as fakeFs } from '@/app/fake-fs'
import { services as kuma } from '@/app/kuma/debug'

(async () => {
  const $ = {
    mswHandlers: token('msw.handlers'),
    ...TOKENS,
    ...FAKE_FS,
  }
  const get = build(
    fakeFs($),
    e2e($),
    application($),
    kuma($),
  )

  setupSteps({
    mock: get($.mock),
    client: get($.client),
  })
})()
