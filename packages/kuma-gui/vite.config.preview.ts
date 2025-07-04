import { replicateKumaServer } from '@kumahq/config/vite'
import { defineConfig } from 'vite'

import type { UserConfigFn } from 'vite'

export const config = (): UserConfigFn => () => {
  return {
    plugins: [
      replicateKumaServer({
        template: './dist/gui/index.html',
      }),
    ],
    preview: {
      port: 5681,
    },
  }
}

export default defineConfig(config())
