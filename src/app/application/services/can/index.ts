export type Can = (str: string, obj?: any) => boolean
export default (features: Record<string, (...args: any[]) => boolean>) => {
  const can: Can = (str, obj) => {
    const feature = features[str]
    if (typeof feature !== 'undefined') {
      return features[str](can, obj)
    }
    return false
  }
  return can
}
