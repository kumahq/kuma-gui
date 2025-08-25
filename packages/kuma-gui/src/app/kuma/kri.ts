/**
 * Examples: https://github.com/kumahq/kuma/blob/master/docs/madr/decisions/077-migrating-to-consistent-and-well-defined-naming-for-non-system-envoy-resources-and-stats.md#examples
 */

export type ContextualKriString = `self_${string}_${string}`
export type FullKriString = `kri_${string}_${string}_${string}_${string}_${string}_${string}`
export type KriString = ContextualKriString | FullKriString
export type ContextualKriObject = {
  context: string
  sectionName: string
}
export type FullKriObject = {
  shortName: string
  mesh: string
  zone: string
  namespace: string
  name: string
  sectionName: string
}
export type KriObject = ContextualKriObject | FullKriObject

class ContextualKri {
  static fromString(kri: ContextualKriString) {
    const parts = kri.split('_').slice(1)
    const context = parts.slice(0, -1).join('_')
    return {
      context,
      sectionName: parts[parts.length - 1],
    }
  }

  static isContextualKriString(kri: string): kri is ContextualKriString {
    return kri.startsWith('self_')
  }

  static isContextualKriObject(kri: Partial<KriObject>): kri is ReturnType<typeof ContextualKri.fromString> {
    return 'context' in kri && 'sectionName' in kri
  }

  static toString(kri: ReturnType<typeof ContextualKri.fromString>): ContextualKriString {
    const { context, sectionName } = kri
    return `self_${context}_${sectionName}`
  }
}

export class Kri {
  static fromString(kri: ContextualKriString): ContextualKriObject
  static fromString(kri: FullKriString): FullKriObject
  static fromString(kri: string): FullKriObject | ContextualKriObject
  static fromString(kri: KriString) {
    if(ContextualKri.isContextualKriString(kri)) return ContextualKri.fromString(kri)

    const [
      shortName = '',
      mesh = '',
      zone = '',
      namespace = '',
      name = '',
      sectionName = '',
    ] = kri.split('_').slice(1)

    return {
      shortName,
      mesh,
      zone,
      namespace,
      name,
      sectionName,
    }
  }

  static isKriString(kri: string): kri is FullKriString {
    return kri.startsWith('kri_') && kri.split('_').length === 7
  }

  static toString(kri: Partial<ContextualKriObject>): ContextualKriString
  static toString(kri: Partial<FullKriObject>): FullKriString
  static toString(kri: Partial<FullKriObject> | ContextualKriObject): KriString {
    if(ContextualKri.isContextualKriObject(kri)) return ContextualKri.toString(kri)

    const { shortName = '', mesh = '', zone = '', namespace = '', name = '', sectionName = '' } = kri
    return `kri_${shortName}_${mesh}_${zone}_${namespace}_${name}_${sectionName}`
  }
}
