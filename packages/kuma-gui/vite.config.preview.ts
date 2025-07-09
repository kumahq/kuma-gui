import { replicateKumaServer , defineConfig as defineBaseConfig, yamlLoaderPluginConfig, vuePluginConfig } from '@kumahq/config/vite'
import fakeApi from '@kumahq/fake-api/vite'
import yamlLoader from '@modyfi/vite-plugin-yaml'
import vue from '@vitejs/plugin-vue'
import { defineConfig, mergeConfig } from 'vite'
import svgLoader from 'vite-svg-loader'

import { dependencies } from './src/test-support'
import { fs } from './src/test-support/mocks/fs'
import type { UserConfigFn } from 'vite'

export const config: UserConfigFn = () => {
  return {
    preview: {
      port: 5681,
    },
    plugins: [
      vue(vuePluginConfig()),
      yamlLoader(yamlLoaderPluginConfig()),
      svgLoader(),
      replicateKumaServer({
        template: './dist/gui/index.html',
      }),
      fakeApi({ dependencies, fs }),
    ],
  }
}

export default defineConfig((env) => 
  mergeConfig(
    defineBaseConfig(env),
    config(env),
  ),
)
