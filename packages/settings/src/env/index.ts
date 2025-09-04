export type EnvParameters<T extends Record<string, unknown>> = {
  [K in keyof T]: [K, string?]
}[keyof T]

export type VariablesSpec<T extends Record<string, unknown>> = {
  [K in keyof T]: (env: (...args: EnvParameters<T>) => string) => any
}

export default <T extends Record<string, unknown>>(vars: VariablesSpec<T>) => {
  const env = (...args: EnvParameters<T>) => {
    const [str, d = ''] = args
    const getter = vars[str]
    if (typeof getter === 'function') {
      return String(getter(env) ?? d)
    }
    return String(d)
  }
  return env
}
