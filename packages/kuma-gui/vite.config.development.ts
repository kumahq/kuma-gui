import { defineConfig, mergeConfig } from 'vite'

import { config as prodConfig } from './vite.config.production'
import type { UserConfigFn, UserConfig } from 'vite'

// https://vitejs.dev/config/
export const config: UserConfigFn = (env) => {
  return mergeConfig(
    prodConfig(env),
    {} satisfies UserConfig,
  )
}
export default defineConfig(config)
