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
type KRIable = { shortName: string, labels: Record<string, string | undefined>, name: string, mesh?: string }
export const KRI = {
  parse: (str: string) => Kri.fromString(str),
  stringify: (item: Parameters<typeof Kri['toString']>[0] | KRIable): KriString => {
    switch(true) {
      case 'labels' in item: {
        const labels = item.labels
        // check mesh property first, then label, default ''
        const mesh = item.mesh ?? labels['kuma.io/mesh'] ?? ''
        // only add a zone if the origin is zone
        const zone = labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : ''

        // nspace and name use labels and fallback to whatever is in the original name
        const [n, nspace = ''] = item.name.split('.')
        const namespace = labels['k8s.kuma.io/namespace'] ?? nspace
        const name = labels['kuma.io/display-name'] ?? n

        return KRI.stringify({
          shortName: item.shortName,
          mesh,
          zone,
          namespace,
          name,
        })
      }

      default:
        return Kri.toString(item)
    }
  },
  split: (kri: string) => {
    const { shortName, mesh, zone, namespace, name } = KRI.parse(kri)

    return {
      kri,
      name,
      // temporarily keep id until its phased out in favour of kri
      id: `${name}${namespace.length > 0 ? `.${namespace}` : ''}`,
      mesh,
      zone,
      namespace,
      shortName,
      // mesh: (name => ({
      //   name,
      //   kri: KRI.stringify({ shortName: 'm', name}),
      // }))(shortName === 'm' ? name : mesh),
      // zone: (name => ({
      //   name,
      //   kri: KRI.stringify({ shortName: 'z', name}),
      // }))(shortName === 'z' ? name : zone),
      // namespace: (name => ({
      //   name,
      //   kri: KRI.stringify({ shortName: '~nspace', name}),
      // }))(namespace),
    }
  },

}

