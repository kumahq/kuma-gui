/// <reference types="vitest/config" />
import { defineConfig as defineBaseConfig, vuePluginConfig } from '@kumahq/config/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig, mergeConfig } from 'vite'

import type { UserConfig, UserConfigFn } from 'vite'

export const config: UserConfigFn = () => {
  return {
    plugins: [
      vue(vuePluginConfig()),
    ],
  } satisfies UserConfig
}

export default defineConfig((env) =>
  mergeConfig(
    defineBaseConfig(env),
    config(env),
  ),
)
