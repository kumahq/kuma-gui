import { replicateKumaServer } from '@kumahq/config/vite'
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
    ],
  }
}

export default defineConfig(config)
