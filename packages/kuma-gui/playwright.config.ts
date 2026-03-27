import { config } from '@kumahq/config/playwright'
import { defineConfig } from '@playwright/test'

// The only thing you cannot set --ui via TS playwright.config therefore --ui
// is conditionally added via the CLI via our Makefile via @kumahq/config

const headed = (process.env.KUMA_TEST_BROWSER || '').length > 0

export default defineConfig(
  config({
    features: 'features/**/*.feature',
    steps: 'playwright/main.ts',
  }),
  {
    ...(headed ? { workers: 1, fullyParallel: false, maxFailures: 0, forbidOnly: false } : {}),
    use: {
      ...(headed ? { headless: false } : {}),
      baseURL: process.env.KUMA_BASE_URL || 'http://localhost:5681/gui',
    },
    shard: {
      current: parseInt(process.env.KUMA_E2E_SHARD_CURRENT || '1'),
      total: parseInt(process.env.KUMA_E2E_SHARD_TOTAL || '1'),
    },
  },
)
