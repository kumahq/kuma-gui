import { replicateKumaServer , defineConfig as defineBaseConfig, sharedPlugins } from '@kumahq/config/vite'
import fakeApi from '@kumahq/fake-api/vite'
import { defineConfig, mergeConfig } from 'vite'

import { dependencies } from './src/test-support'
import { fs } from './src/test-support/mocks/fs'
import type { UserConfigFn } from 'vite'

export const config = (): UserConfigFn => () => {
  return {
    preview: {
      port: 5681,
    },
    plugins: [
      sharedPlugins.vue,
      sharedPlugins.svgLoader,
      sharedPlugins.yamlLoader,
      replicateKumaServer({
        template: './dist/gui/index.html',
      }),
      fakeApi({
        dependencies,
        fs,
      }),
    ],
  }
}

export default defineConfig((env) => 
  mergeConfig(
    defineBaseConfig()(env),
    config()(env)),
)
