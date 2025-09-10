type Fn = (...args: any[]) => any
type RestParams<T extends Fn> = Parameters<T> extends [any, ...infer Rest] ? Rest : []

export type Features<T extends Record<string, Fn>> = {
  [K in keyof T]: [K, ...RestParams<T[K]>]
}[keyof T]

export type FeatureSpec<T extends Record<string, Fn>> = {
  [K in keyof T]: (
    can: (...args: Features<T>) => boolean,
    ...rest: RestParams<T[K]>
  ) => any
}

const features = <T extends Record<string, Fn>>(features: FeatureSpec<T>) => {
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

export default features
