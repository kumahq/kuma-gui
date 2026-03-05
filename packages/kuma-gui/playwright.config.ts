import { defineConfig } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: 'playwright/main.ts',
})

export default defineConfig({
  testDir,
  reporter: '',
})
