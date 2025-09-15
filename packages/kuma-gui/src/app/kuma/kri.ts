/**
 * Examples: https://github.com/kumahq/kuma/blob/master/docs/madr/decisions/077-migrating-to-consistent-and-well-defined-naming-for-non-system-envoy-resources-and-stats.md#examples
 */

type KriString = `kri_${string}_${string}_${string}_${string}_${string}_${string}`

export class Kri {
  static fromString(kri: string) {
    if(!Kri.isKriString(kri)) {
      return {
        shortName: '',
        mesh: '',
        zone: '',
        namespace: '',
        name: '',
        sectionName: '',
      }
    }

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

  static isKriString(kri: string): kri is KriString {
    return kri.startsWith('kri_') && kri.split('_').length === 7
  }

  static toString(kri: Partial<ReturnType<typeof Kri.fromString>>) {
    const { shortName = '', mesh = '', zone = '', namespace = '', name = '', sectionName = '' } = kri
    return `kri_${shortName}_${mesh}_${zone}_${namespace}_${name}_${sectionName}` satisfies KriString
  }
}
