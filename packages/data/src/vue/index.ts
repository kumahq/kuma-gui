import { DataSourcePool, create, destroy } from '../'
// import {
//   DataLoader,
//   DataSink,
//   DataSource,
// } from './components'
import type { Plugin } from 'vue'

export * from './components'

// const components = [
//   ['DataLoader', DataLoader],
//   ['DataSink', DataSink],
//   ['DataLoader', DataSource],
// ] as const

// declare module 'vue' {
//   export interface GlobalComponents {
//     DataLoader: typeof DataLoader
//     DataSink: typeof DataSink
//     DataSource: typeof DataSource
//   }
// }

/* copy/pasta-ble containers */
declare const typeSymbol: unique symbol
type Uri<T = unknown> = { [typeSymbol]: T }
type TypeOf<T> = T extends Uri<infer UriType> ? UriType : never
//

/* nano-container */
const nano = (map = new Map<Uri, unknown>()) => {
  type Service<T> = () => TypeOf<T>
  const uri = <T>(str: string): Uri<T> => Symbol.for(str) as symbol & Uri<T>
  const singleton = <T extends Uri>(uri: T, value: Service<T> | undefined) => () => {
    if (typeof value !== 'undefined' && !map.has(uri)) {
      map.set(uri, value())
    }
    return map.get(uri) as TypeOf<T>
  }
  return { singleton, uri }
}
/* */
const { singleton, uri } = nano()
const deps = {
  dataSourcePool: new DataSourcePool({
    'data:application/json,:uri': async (params) => {
      return JSON.parse(typeof params.uri === 'string' ? params.uri: '{}')
    },
  }, { create, destroy }),
}
const tokens = {
  dataSourcePool: uri<typeof deps.dataSourcePool>('data.data-source-pool'),
}
export const useDataSourcePool = singleton(tokens.dataSourcePool, () => deps.dataSourcePool)
const plugin: Plugin = {
  install: (app, options: Partial<typeof deps> = {}) => {
    Object.assign(deps, options)
    // components.forEach(([name, item]) => {
    //   app.component(name, item as Component)
    // })
    // directives.forEach(([name, item]) => {
    //   app.directive(name, item)
    // })
  },
}
export default plugin
