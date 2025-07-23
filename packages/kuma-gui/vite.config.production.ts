import { replicateKumaServer, defineConfig as defineBaseConfig, yamlLoaderPluginConfig, vuePluginConfig } from '@kumahq/config/vite'
import fakeApi from '@kumahq/fake-api/vite'
import yamlLoader from '@modyfi/vite-plugin-yaml'
import vue from '@vitejs/plugin-vue'
import { defineConfig, mergeConfig } from 'vite'
import svgLoader from 'vite-svg-loader'

import { dependencies } from './src/test-support'
import { fs } from './src/test-support/mocks/fs'
import type { UserConfig, UserConfigFn } from 'vite'
// https://vitejs.dev/config/

export const config: UserConfigFn = () => {
  return {
    plugins: [
      vue(vuePluginConfig()),
      yamlLoader(yamlLoaderPluginConfig()),
      svgLoader(),
      replicateKumaServer(),
      fakeApi({ dependencies, fs }),
    ],
    test: {
      setupFiles: [
        './test-support/main.ts',
      ],
    },
  } satisfies UserConfig
}

export default defineConfig((env) =>
  mergeConfig(
    defineBaseConfig(env),
    config(env),
  ),
)
