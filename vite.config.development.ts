import { defineConfig, mergeConfig, UserConfigFn, UserConfig } from 'vite'
import { config as prodConfig } from './vite.config'

// https://vitejs.dev/config/
export const config: UserConfigFn = (env) => {
  return mergeConfig(
    prodConfig(env),
    ({
      resolve: {
        alias: {
          '/src/services/index.ts': '/src/services/development.ts',
        },
      },
    } as UserConfig),
  )
}
export default defineConfig(config)
