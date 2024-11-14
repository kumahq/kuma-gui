import { cypress } from '@kumahq/config'
import { defineConfig } from 'cypress'
import dotenv from 'dotenv'

const env = dotenv.config().parsed as { [key: string]: string }

Object.entries({
  // default base URL for testing against
  KUMA_BASE_URL: 'http://localhost:5681/gui',
}).forEach(([key, d]: [string, string]) => {
  env[key] = process.env[key] ?? d
})

export default defineConfig({
  ...cypress(env),
})
