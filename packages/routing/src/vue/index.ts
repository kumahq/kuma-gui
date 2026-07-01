import { inject } from 'vue'

import type { Dependencies } from '../'
// import { DataSourcePool, create, destroy } from '../'
// import {
//   RouteTitle,
//   RouteView,
// } from './components'
import type { App, Plugin, InjectionKey } from 'vue'

export * from './components'

// const components = [
//   ['RouteTitle', RouteTitle],
//   ['RouteView', RouteView],
// ] as const

// declare module 'vue' {
//   export interface GlobalComponents {
//     RouteTitle: typeof RouteTitle
//     RouteView: typeof RouteView
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

const deps: Dependencies = {
  can: () => false,
  env: () => '',
  i18n: { t: () => '' },
  regexp: { r: () => new RegExp('') },
}
const tokens = {
  can: uri<Dependencies['can']>('routing.can'),
  env: uri<Dependencies['env']>('routing.env'),
  i18n: uri<Dependencies['i18n']>('routing.i18n'),
  regexp: uri<Dependencies['regexp']>('routing.regexp'),
}
const plugin: Plugin = {
  install: (app, options: Partial<typeof deps> = {}) => {
    const services = {
      ...deps,
      ...options,
    }
    const { build } = createBuilder(nano())
    build(app)
      .service(tokens.can, () => services.can)
      .service(tokens.regexp, () => services.regexp)
      .service(tokens.env, () => services.env)
      .service(tokens.i18n, () => services.i18n)

    // components.forEach(([name, item]) => {
    //   app.component(name, item as Component)
    // })
    // directives.forEach(([name, item]) => {
    //   app.directive(name, item)
    // })
  },
}
export const [ useI18n, useCan, useRegExp, useEnv ] = createInjections(
  tokens.i18n,
  tokens.can,
  tokens.regexp,
  tokens.env,
)
export default plugin
