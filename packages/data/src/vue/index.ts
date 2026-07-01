import { inject } from 'vue'

import { DataSourcePool, create, destroy } from '../'
// import {
//   DataLoader,
//   DataSink,
//   DataSource,
// } from './components'
import type { App, Plugin, InjectionKey } from 'vue'

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
type InjectionHooks<T extends Uri[]> = { [K in keyof T]: T[K] extends Uri ? () => TypeOf<T[K]> : never }
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
type Container = ReturnType<typeof nano>
/* */

const createInjections = <T extends Uri[]>(...tokens: T): InjectionHooks<T> => {
  return tokens.map((token) => {
    return () => {
      type Service = TypeOf<typeof token>
      type Getter = () => Service
      const service = inject(token as unknown as InjectionKey<Getter>) as () => TypeOf<typeof token>
      if(typeof service === 'undefined') {
        throw new Error('Unable to find injection ${token}')
      }
      return service()
    }
  }) as InjectionHooks<T>
}
const createBuilder = (container: Container) => {
  const { singleton, uri } = container
  const build = (app: App) => {
    const builder = {
      service: <T>(uri: Uri<T>, getter: () => T) => {
        app.provide(uri as unknown as InjectionKey<typeof getter>, singleton(uri, getter))
        return builder
      },
    }
    return builder
  }
  return { build, uri }
}


const { uri } = nano()

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
const plugin: Plugin = {
  install: (app, options: Partial<typeof deps> = {}) => {
    const services = {
      ...deps,
      ...options,
    }

    const { build } = createBuilder(nano())
    build(app)
      .service(tokens.dataSourcePool, () => services.dataSourcePool)
    // components.forEach(([name, item]) => {
    //   app.component(name, item as Component)
    // })
    // directives.forEach(([name, item]) => {
    //   app.directive(name, item)
    // })
  },
}

export const [ useDataSourcePool ] = createInjections(
  tokens.dataSourcePool,
)
export default plugin
