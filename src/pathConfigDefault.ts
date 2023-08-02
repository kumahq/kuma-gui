import { PathConfig } from './types/index'

export function getPathConfigDefault(apiUrlDefault: string = ''): PathConfig {
  return {
    baseGuiPath: '/gui',
    apiUrl: apiUrlDefault,
    version: '2.3.0',
    product: 'Kuma',
    mode: 'global',
    environment: 'universal',
    apiReadOnly: false,
  }
}
