import { defineConfig } from 'vite'

import { replicateKumaServer } from './vite.plugins'
import type { UserConfigFn } from 'vite'

export const config = (): UserConfigFn => () => {
  return {
    plugins: [
      replicateKumaServer('./dist/gui/index.html'),
    ],
    preview: {
      port: 5681,
    },
  }
}

export default defineConfig(config())
