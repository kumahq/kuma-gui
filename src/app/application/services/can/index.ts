export type Can = (str: string, obj?: any) => boolean
export type Features = Record<string, (can: Can, obj?: any) => boolean>
export default (features: Features) => {
  const can: Can = (str, obj) => {
    const feature = features[str]
    if (typeof feature !== 'undefined') {
      return features[str](can, obj)
    }
    return false
  }
  return can
}
