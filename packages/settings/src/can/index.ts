export interface Abilities {}
// @ts-ignore
export type Can = Abilities['can']

type ParamsExceptFirst<T extends any[]> = T extends [any, ...infer Rest] ? Rest : []

export type Features<T extends Record<string, (...args: any[]) => boolean>> = {
  [K in keyof T]: ParamsExceptFirst<Parameters<T[K]>> extends [] ? [K] : [K, ...ParamsExceptFirst<Parameters<T[K]>>]
}[keyof T]

type Feature = (can: Can, obj?: any) => boolean
export default (features: Record<string, Feature>) => {
  const can: Can = (str: string, obj?: unknown) => {
    const feature = features[str]
    if (typeof feature !== 'undefined') {
      return !!features[str](can, obj)
    }
    return false
  }
  return can
}
