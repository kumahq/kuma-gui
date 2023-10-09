import {
  createContainer,
  token,
  Token,
  TokenType,
  TokenValue,
  RequiredToken,
  OptionalToken,
  injected,
} from 'brandi'
import deepmerge from 'deepmerge'

export {
  token,
  token as label,
} from 'brandi'
export type {
  TokenType,
  Token,
} from 'brandi'

type InjectionHooks<T extends TokenValue[]> = {
  [K in keyof T]: T[K] extends TokenValue ? () => TokenType<T[K]> : never;
};

type UnknownConstructor<T> = new (
  ...args: never[]
) => T;

type UnknownFunction<T = unknown> = (...args: never[]) => T;

type UnknownCreator<T = unknown> =
  | UnknownConstructor<T>
  | UnknownFunction<T>;

type DependencyDefinition = {
  constant?: unknown
  service?: UnknownCreator<unknown>
  arguments?: Array<RequiredToken | OptionalToken>
  shared?: boolean
  labels?: Token[]
  decorates?: Token
}
export type ServiceDefinition = [Token, DependencyDefinition]
export type ServiceConfigurator<T = Record<string, Token>> = ($: T) => ServiceDefinition[]
export type Alias<T extends (...args: never[]) => unknown> = (...rest: Parameters<T>) => ReturnType<T>
export type Decorator<T extends TokenValue> = TokenType<T>
export type ReturnDecorated<T extends TokenValue> = () => TokenType<T>
export const container = createContainer()

//
export const merge = (...definitions: Array<ServiceDefinition[]>): ServiceDefinition[] => {
  return [...new Map([...definitions.flat()]).entries()]
}
const decorate = (entries: ServiceDefinition[]) => {
  const map = new Map(entries)
  entries.forEach(([_token, definition]) => {
    if (typeof definition.decorates !== 'undefined') {
      const decoratedToken = definition.decorates
      const decoratedDefinition = map.get(decoratedToken)
      if (typeof decoratedDefinition !== 'undefined') {
        // set up a structure that allows us to only get the decorated service
        // when we want to. i.e. we might want to call/get the service then execute more code, or
        // we might want to call/get the service last after executing code
        const { labels, ...decorated } = decoratedDefinition
        type DecoratedToken = typeof decoratedToken
        const TOKEN = token<TokenType<DecoratedToken>>('inner')
        const WRAPPER_TOKEN = token<ReturnDecorated<DecoratedToken>>('inner.wrapper')
        map.set(TOKEN, {
          ...decorated,
        })
        map.set(WRAPPER_TOKEN, {
          service: (): ReturnDecorated<DecoratedToken> => () => get(TOKEN),
        })

        map.set(decoratedToken,
          {
            ...definition,
            arguments: [
              WRAPPER_TOKEN,
              // adding further arguments is currently unsupported
              // ...(definition.arguments || []),
            ],
            labels,
          },
        )
      }
      definition.decorates = undefined
    }
  })
  return [...map.entries()]
}
export const get = <T extends TokenValue>(token: T): TokenType<T> => container.get(token)
export const build = (...entries: Array<ServiceDefinition[]>): typeof get => {
  const merged = decorate(merge(...entries))
  merged.forEach(item => service(...item))
  return get
}

export const createInjections = <T extends TokenValue[]>(
  ...tokens: T
): InjectionHooks<T> =>
  tokens.map((token) => () => get(token)) as InjectionHooks<T>
//

const labelMap = new WeakMap()
export const service = (t: Token, config: DependencyDefinition): void => {
  const bound = container.bind(t)
  switch (true) {
    case 'constant' in config:
      bound.toConstant(config.constant as Parameters<typeof bound.toConstant>[0])
      break
    case 'service' in config: {
      const s = bound.toInstance(config.service as UnknownCreator<TokenType<typeof t>>)
      if (typeof config.shared === 'undefined' || config.shared === true) {
        s.inSingletonScope()
      }
      break
    }
  }
  if (typeof config.labels !== 'undefined') {
    config.labels.forEach((label: Token) => {
      if (!labelMap.has(label)) {
        labelMap.set(label, [])
        service(label, {
          service: () => {
            return labelMap.get(label).reduce((prev: unknown[], TOKEN: Token) => {
              try {
                const service = get(TOKEN)
                if (Array.isArray(service)) {
                  return prev.concat(service)
                } else if (service instanceof Object) {
                  return deepmerge(prev, service)
                } else {
                  return prev
                }
              } catch (e) {
                console.error(e)
                throw e
              }
            }, [])
          },
        })
      }
      const tokens = labelMap.get(label)
      tokens.push(t)
    })
  }
  if (typeof config.arguments !== 'undefined' && typeof config.service !== 'undefined') {
    config.arguments.forEach((item, i) => {
      if (typeof item === 'undefined') {
        throw new Error(`Unable to find token for argument[${i}]`)
      }
    })
    injected(...([config.service, ...config.arguments] as Parameters<typeof injected>))
  }
}
export const constant = <T>(func: T, config: { description: string }): Token<T> => {
  const t = token<T>(config.description)
  const bound = container.bind(t)
  bound.toConstant(func as Parameters<typeof bound.toConstant>[0])
  return t as Token<T>
}
