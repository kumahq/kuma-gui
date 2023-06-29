import { defineConfig, mergeConfig, UserConfigFn, UserConfig, Plugin } from 'vite'

import { config as prodConfig } from './vite.config'
// https://vitejs.dev/config/
export const config: UserConfigFn = (env) => {
  const c = mergeConfig(
    prodConfig(env),
    ({
    } as UserConfig),
  )
  deletePlugin(c.plugins, 'vite:remove-console')
  return c
}
export default defineConfig(config)
function deletePlugin(plugins: Plugin[], pluginName: string): void {
  for (let i = plugins.length - 1; i >= 0; i--) {
    const plugin = plugins[i]

    if (Array.isArray(plugin)) {
      deletePlugin(plugin, pluginName)
    } else if (plugin.name === pluginName) {
      plugins.splice(i, 1)
    }
  }
}
