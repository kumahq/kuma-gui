import { build, token } from '@kumahq/container'
import { setupSteps } from '@kumahq/gherkin-web/playwright'
import env from '@kumahq/settings/env'

import { TOKENS as FAKE_FS, services as fakeFs } from '@/app/fake-fs'
import { services as kuma } from '@/app/kuma/debug'

(async () => {
  const $ = {
    mswHandlers: token('msw.handlers'),
    ...FAKE_FS,
    env: token<typeof env>('playwright.env'),
    vars: token('playwright.env.vars'),
  }
  const get = build(
    // mocks
    fakeFs($),
    kuma($),
    [
      [token('playwright.env.vars'), {
        service: () => {
          // these are only fed to the mocks
          return {
            KUMA_API_URL: () => 'http://localhost:5681',
          }
        },
        labels: [
          $.vars,
        ],
      }],

      [$.env, {
        service: env,
        arguments: [
          $.vars,
        ],
      }],
    ],
  )
  setupSteps({
    baseURL: 'http://localhost:8080/gui',
    dependencies: get($.dependencies),
    fs: get($.fakeFS),
  })
})()
