export type Variables<T extends Record<string, unknown>> = {
  [K in keyof T]: [K, string?]
}[keyof T]

export type VariableSpec<T extends Record<string, unknown>> = {
  [K in keyof T]: (
    env: (...args: Variables<T>) => string,
  ) => any
}

export default <T extends Record<string, unknown>>(vars: VariableSpec<T>) => {
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
