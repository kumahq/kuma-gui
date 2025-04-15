import { cypress } from '@kumahq/config'
import { defineConfig } from 'cypress'

const env = Object.entries({
  // default base URL for testing against
  KUMA_BASE_URL: 'http://localhost:5681/gui',
  KUMA_API_URL: 'http://localhost:5681',
}).reduce((prev, [key, d]: [string, string]) => {
  prev[key] = process.env[key] ?? d
  return prev
}, {} as Record<string, string>)

export default defineConfig({
  ...cypress(env),
})
