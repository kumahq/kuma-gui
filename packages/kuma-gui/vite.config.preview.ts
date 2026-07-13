import { replicateKumaServer, playwrightBdd } from '@kumahq/config/vite'
import fakeApi from '@kumahq/fake-api/vite'
import { fs, dependencies } from '@kumahq/kuma-http-api/mocks'
import { defineConfig } from 'vite'

import type { UserConfigFn } from 'vite'

export const config: UserConfigFn = () => {
  const kuma = 'http://localhost:5680'
  const api = 'http://localhost:5681'
  return {
    preview: {
      port: parseInt(new URL(process.env.KUMA_BASE_URL ?? kuma).port),
    },
    plugins: [
      replicateKumaServer({
        template: './dist/gui/index.html',
        vars: {
          apiUrl: process.env.KUMA_API_URL ?? api,
        },
      }),
      fakeApi({ dependencies, fs }),
      playwrightBdd(),
    ],
  }
}

export default defineConfig(config)
