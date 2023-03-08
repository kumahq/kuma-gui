import { fileURLToPath, URL } from 'url'
import { defineConfig, mergeConfig, UserConfigFn, UserConfig } from 'vite'

import { config as prodConfig } from './vite.config'
// https://vitejs.dev/config/
export const config: UserConfigFn = (env) => {
  return mergeConfig(
    prodConfig(env),
    ({
      resolve: {
        alias: [
          { find: /^@\/services$/, replacement: fileURLToPath(new URL('./src/services/development.ts', import.meta.url)) },
        ],
      },
    } as UserConfig),
  )
}
export default defineConfig(config)
