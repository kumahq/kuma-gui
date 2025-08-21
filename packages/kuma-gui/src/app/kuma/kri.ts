/**
 * Examples: https://github.com/kumahq/kuma/blob/master/docs/madr/decisions/077-migrating-to-consistent-and-well-defined-naming-for-non-system-envoy-resources-and-stats.md#examples
 */

export class Kri {
  static fromString(kri: string) {
    const parts = kri.split('_').slice(1)
    return {
      shortName: parts[0],
      mesh: parts[1],
      zone: parts[2],
      namespace: parts[3],
      name: parts[4],
      sectionName: parts[5],
    }
  }

  static toString(kri: Partial<ReturnType<typeof Kri.fromString>> ) {
    const { shortName = '', mesh = '', zone = '', namespace = '', name = '', sectionName = '' } = kri
    return `kri_${shortName}_${mesh}_${zone}_${namespace}_${name}_${sectionName}`
  }

  static isKri(kri: string) {
    return kri.startsWith('kri_') && kri.split('_').length === 7
  }
}

export class ContextualKri {
  static fromString(kri: string) {
    const parts = kri.split('_').slice(1)
    const context = parts.slice(0, -1).join('_')
    return {
      context,
      sectionName: parts[parts.length - 1],
    }
  }

  static toString(kri: ReturnType<typeof ContextualKri.fromString>) {
    const { context, sectionName } = kri
    return `self_${context}_${sectionName}`
  }
}
