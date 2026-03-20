import { defineBddConfig } from 'playwright-bdd'

import type { PlaywrightTestConfig } from '@playwright/test'

export const config = (config: Parameters<typeof defineBddConfig>[0] = {}) => {
  const testDir = defineBddConfig(config)
  return {
    fullyParallel: true,
    maxFailures: process.env.CI ? 1 : 0,
    forbidOnly: !!process.env.CI,
    testDir,
    outputDir: './test-results',
    reporter: [
      ['html', { outputFolder: 'playwright-report', open: 'never' }],
      ['list'],
      ...(process.env.CI ? [['github'] as const] : []),
    ],
    use: {
      timezoneId: 'UTC',
      viewport: { width: 1920, height: 1080 },
      video: 'retain-on-failure',
      screenshot: 'only-on-failure',
      trace: 'retain-on-failure',
    },
  } satisfies PlaywrightTestConfig
}
