import { defineConfig, mergeConfig, type UserConfigFn, type UserConfig } from 'vite'

import { config as prodConfig } from './vite.config.production'
// https://vitejs.dev/config/
export const config: UserConfigFn = (env) => {
  return mergeConfig(
    prodConfig(env),
    {} satisfies UserConfig,
  )
}
export default defineConfig(config)
