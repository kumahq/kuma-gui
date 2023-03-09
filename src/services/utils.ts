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

export {
  token,
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
  labels?: Array<RequiredToken | OptionalToken>
}
export type ServiceDefinition = [Token, DependencyDefinition]

export const container = createContainer()

//
export const merge = (...definitions: Array<ServiceDefinition[]>): ServiceDefinition[] => {
  return [...new Map([...definitions.flat()]).entries()]
}
export const build = (...entries: Array<ServiceDefinition[]>): ServiceDefinition[] => {
  const merged = merge(...entries)
  merged.forEach(item => service(...item))
  return merged
}

export const get = <T extends TokenValue>(token: T): TokenType<T> => container.get(token)
export const createInjections = <T extends TokenValue[]>(
  ...tokens: T
): InjectionHooks<T> =>
  tokens.map((token) => () => get(token)) as InjectionHooks<T>
//
export const service = (t: Token, config: DependencyDefinition): void => {
  const bound = container.bind(t)
  switch (true) {
    case 'constant' in config:
      bound.toConstant(config.constant as Parameters<typeof bound.toConstant>[0])
      return
    case 'service' in config: {
      const s = bound.toInstance(config.service as Parameters<typeof bound.toInstance>[0])
      if (typeof config.shared === 'undefined' || config.shared === true) {
        s.inSingletonScope()
      }
      break
    }
  }
  if (typeof config.arguments !== 'undefined' && typeof config.service !== 'undefined') {
    injected(...([config.service, ...config.arguments] as Parameters<typeof injected>))
  }
}
export const constant = <T>(func: T, config: { description: string }): Token<T> => {
  const t = token<T>(config.description)
  const bound = container.bind(t)
  bound.toConstant(func as Parameters<typeof bound.toConstant>[0])
  return t as Token<T>
}
