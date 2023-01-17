import { defineConfig } from 'vite'
import { config as prodConfig } from './vite.config'

// https://vitejs.dev/config/
export const config = ({ mode }) => {
  const config = prodConfig({ mode })
  //
  config.resolve.alias = {
    ...config.resolve.alias,
    ...{
      '/src/services/index.ts': '/src/services/development.ts',
    },
  }
  return config
}

export default defineConfig(({ mode }) => config({ mode }))
