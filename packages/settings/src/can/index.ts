type EnsureFunction<T> = T extends (...args: any[]) => any ? T : never
type ParamsExceptFirst<T extends any[]> = (T extends [any, ...infer Rest] ? Rest : []) | []

export type Features<T extends Record<string, unknown>> = {
  [K in keyof T]: ParamsExceptFirst<Parameters<EnsureFunction<T[K]>>> extends [] ? [K] : [K, ...ParamsExceptFirst<Parameters<EnsureFunction<T[K]>>>]
}[keyof T]

export type FeatureSpec<T extends Record<string, unknown>> = {
  [K in keyof T]: (
    can: (...args: Features<T>) => boolean,
    //
    ...rest: ParamsExceptFirst<Parameters<EnsureFunction<T[K]>>>
    ///
  ) => any
}
// export type FeatureSpec<T extends Record<string, unknown>> = {
//   [K in keyof T & string]: EnsureFunction<T[K]>
// }


export default <T extends Record<string, unknown>>(features: FeatureSpec<T>) => {
  const can = (...args: Features<T>) => {
    const [str, ...rest] = args
    const feature = features[str]
    if (typeof feature !== 'undefined') {
      const res = features[str](can, ...rest)
      if (typeof res === 'string') {
        return !!JSON.parse(res)
      } else {
        return !!res
      }
    }
    return false
  }
  return can
}
