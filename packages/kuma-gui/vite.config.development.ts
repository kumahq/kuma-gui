import { replicateKumaServer, defineConfig as defineBaseConfig, sharedPlugins } from '@kumahq/config/vite'
import fakeApi from '@kumahq/fake-api/vite'
import { defineConfig, mergeConfig } from 'vite'

import { dependencies } from './src/test-support'
import { fs } from './src/test-support/mocks/fs'
import type { UserConfig, UserConfigFn } from 'vite'
// https://vitejs.dev/config/

export const config: UserConfigFn = () => {
  return {
    plugins: [
      sharedPlugins.vue,
      sharedPlugins.svgLoader,
      sharedPlugins.yamlLoader,
      replicateKumaServer(),
      fakeApi({
        dependencies,
        fs,
      }),
    ],
  } satisfies UserConfig
}

export default defineConfig((env) =>
  mergeConfig(
    defineBaseConfig()(env), config(env),
  ),
)
