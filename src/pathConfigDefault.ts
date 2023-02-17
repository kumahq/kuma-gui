import { PathConfig } from './types/index'

export function getPathConfigDefault(apiUrlDefault: string): PathConfig {
  return {
    baseGuiPath: '',
    // **TIP**: Change this value to test various GUI base path scenarios.
    // baseGuiPath: '/dev/gui',
    apiUrl: apiUrlDefault,
    version: '1.7.0',
  }
}
