import { devices } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'

import type { PlaywrightTestConfig } from '@playwright/test'

export const config = (config: Parameters<typeof defineBddConfig>[0] = {}) => {
  const testDir = defineBddConfig(config)
  return {
    ...(process.env.CI ? {
      maxFailures: 1,
    } : {}),
    fullyParallel: true,
    forbidOnly: true,
    testDir,
    outputDir: './test-results',
    reporter: [
      ['html', { outputFolder: 'playwright-report', open: 'never' }],
      ['list'],
      ...(process.env.CI ? [['github'] as const] : []),
    ],
    use: {
      headless: true,
      timezoneId: 'UTC',
      ...(process.env.PLAYWRIGHT_WINDOW_POSITION ? {
        launchOptions: {
          args: [`--window-position=${process.env.PLAYWRIGHT_WINDOW_POSITION}`],
        },
      } : {}),
      viewport: { width: 1920, height: 1080 },
      video: 'retain-on-failure',
      screenshot: 'only-on-failure',
      trace: 'retain-on-failure',
    },
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
    ],
  } satisfies PlaywrightTestConfig
}
