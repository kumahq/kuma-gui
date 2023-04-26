import { PathConfig } from './types/index'

export function getPathConfigDefault(apiUrlDefault: string = ''): PathConfig {
  return {
    baseGuiPath: '/gui',
    apiUrl: apiUrlDefault,
    version: '1.7.0',
  }
}
