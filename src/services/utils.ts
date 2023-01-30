import {
  createContainer,
  token,
  Token,
  TokenType,
  TokenValue,
} from 'brandi'

export {
  injected,
} from 'brandi'

type InjectionHooks<T extends TokenValue[]> = {
  [K in keyof T]: T[K] extends TokenValue ? () => TokenType<T[K]> : never;
};

type DependencyDefinition = {
  description: string
}
type UnknownConstructor<T> = new (
  ...args: never[]
) => T;

type UnknownFunction<T = unknown> = (...args: never[]) => T;

type UnknownCreator<T = unknown> =
  | UnknownConstructor<T>
  | UnknownFunction<T>;

export const container = createContainer()

//

export const get = <T extends TokenValue>(token: T): TokenType<T> => container.get(token)
export const createInjections = <T extends TokenValue[]>(
  ...tokens: T
): InjectionHooks<T> =>
  tokens.map((token) => () => get(token)) as InjectionHooks<T>
//

export const service = <T>(func: UnknownCreator<T>, config: DependencyDefinition): Token<T> => {
  const t = token<T>(config.description)
  const bound = container.bind(t)
  bound.toInstance(func as Parameters<typeof bound.toInstance>[0])
    .inSingletonScope()
  return t as Token<T>
}
export const set = <T>(t: Token, func: UnknownCreator<T>) => {
  const bound = container.bind(t)
  bound.toInstance(func as Parameters<typeof bound.toInstance>[0])
    .inSingletonScope()
  return func
}
export const constant = <T>(func: T, config: DependencyDefinition): Token<T> => {
  const t = token<T>(config.description)
  const bound = container.bind(t)
  bound.toConstant(func as Parameters<typeof bound.toConstant>[0])
  return t as Token<T>
}
