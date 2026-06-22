import { replicateKumaServer, playwrightBdd } from '@kumahq/config/vite'
import fakeApi from '@kumahq/fake-api/vite'
import { fs, dependencies } from '@kumahq/kuma-http-api/mocks'
import { defineConfig } from 'vite'

import type { UserConfigFn } from 'vite'

export const config: UserConfigFn = () => {
  return {
    preview: {
      port: 5681,
    },
    plugins: [
      replicateKumaServer({
        template: './dist/gui/index.html',
      }),
      fakeApi({ dependencies, fs }),
      playwrightBdd(),
    ],
  }
}

export default defineConfig(config)
