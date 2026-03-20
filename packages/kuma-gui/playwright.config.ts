import { config } from '@kumahq/config/playwright'
import { defineConfig } from '@playwright/test'

export default defineConfig(
  config({
    features: 'features/**/*.feature',
    steps: 'playwright/main.ts',
  }),
  {
    use: {
      headless: false, //!!process.env.CI,
      baseURL: 'http://localhost:8080',
    },
  },
)
