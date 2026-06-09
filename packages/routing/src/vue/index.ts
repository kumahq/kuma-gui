import type { Dependencies } from '../'
// import { DataSourcePool, create, destroy } from '../'
// import {
//   RouteTitle,
//   RouteView,
// } from './components'
import type { Plugin } from 'vue'

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
export const [ useCan, useI18n, useRegExp, useEnv] = [
  singleton(tokens.can, () => deps.can),
  singleton(tokens.i18n, () => deps.i18n),
  singleton(tokens.regexp, () => deps.regexp),
  singleton(tokens.env, () => deps.env),
]
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
