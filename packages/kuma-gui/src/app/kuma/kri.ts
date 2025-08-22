/**
 * Examples: https://github.com/kumahq/kuma/blob/master/docs/madr/decisions/077-migrating-to-consistent-and-well-defined-naming-for-non-system-envoy-resources-and-stats.md#examples
 */

type ContextualKriString = `self_${string}_${string}`
type FullKriString = `kri_${string}_${string}_${string}_${string}_${string}_${string}`

class ContextualKri {
  static fromString(kri: string) {
    const parts = kri.split('_').slice(1)
    const context = parts.slice(0, -1).join('_')
    return {
      context,
      sectionName: parts[parts.length - 1],
    }
  }

  static isContextualKriString(kri: string): kri is ContextualKriString {
    return kri.startsWith('self_') && kri.split('_').length >= 3
  }

  static isContextualKriObject(kri: unknown): kri is ReturnType<typeof ContextualKri.fromString> {
    return typeof kri === 'object' && kri !== null && 'context' in kri && 'sectionName' in kri
  }

  static toString(kri: Partial<ReturnType<typeof ContextualKri.fromString>>) {
    const { context = '', sectionName = '' } = kri
    return `self_${context}_${sectionName}`
  }
}

export class Kri {
  static fromString(kri: string) {
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

  static toString(kri: Record<string, string>) {
    if(ContextualKri.isContextualKriObject(kri)) return ContextualKri.toString(kri)

    const { shortName = '', mesh = '', zone = '', namespace = '', name = '', sectionName = '' } = kri
    return `kri_${shortName}_${mesh}_${zone}_${namespace}_${name}_${sectionName}`
  }
}
