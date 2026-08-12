export type Variables<T extends Record<string, unknown>> = {
  [K in keyof T]: [K, string?]
}[keyof T]

export type VariableSpec<T extends Record<string, unknown>> = {
  [K in keyof T]: (
    env: (...args: Variables<T>) => string,
  ) => any
}

const createEnv = <T extends Record<string, unknown>>(vars: VariableSpec<T>) => {
  const env = (...args: Variables<T>): string => {
    const [str, d = ''] = args
    const getter = vars[str]
    if (typeof getter === 'function') {
      return String(getter(env) ?? d)
    }
    return String(d)
  }
  return env
}
export default createEnv

/* copy/pasta-ble containers */
declare const typeSymbol: unique symbol
export type Uri<T = unknown> = { [typeSymbol]: T }
export type TypeOf<T> = T extends Uri<infer UriType> ? UriType : never

/* nano-container */
export const nano = (map = new Map<Uri, unknown>()) => {
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
export type Container = ReturnType<typeof nano>

/**
 * More or less the same createBuilder from the other copy/pasteables nano containers,
 * but adds a getter to immediately retrieve a service for the purpose of exposing a
 * nanoEnv. Generally this is agnostic and can be copy/pasted.
 */
export const createBuilder = (container: Container) => {
  const { singleton, uri } = container
  const services = new Map<Uri, () => unknown>()
  const build = {
    service: <T>(token: Uri<T>, getter: () => T) => {
      services.set(token, singleton(token, getter))
      return build
    },
    get: <T extends Uri>(token: T): TypeOf<T> => {
      const service = services.get(token)
      if (typeof service === 'undefined') {
        throw new Error(`Unable to resolve service '${String(token)}'`)
      }
      return service() as TypeOf<T>
    },
  }
  return { build, uri }
}

export function nanoEnv<C, T extends Record<string, unknown>>(
  vars: (config: C) => VariableSpec<T>,
  config: () => C,
) {
  const { build, uri } = createBuilder(nano())
  const tokens = {
    config: uri<C>('env.config'),
    vars: uri<VariableSpec<T>>('env.vars'),
    env: uri<(...args: Variables<T>) => string>('env.env'),
  }
  return build
    .service(tokens.config, config)
    .service(tokens.vars, () => vars(build.get(tokens.config)))
    .service(tokens.env, () => createEnv(build.get(tokens.vars)))
    .get(tokens.env)
}
