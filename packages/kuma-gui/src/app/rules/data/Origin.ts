import { Kri } from '@/app/kuma'
import type { KumaResourceTypeDescriptorCollection } from '@/app/resources/data'
import type { components } from '@kumahq/kuma-http-api'

type ResourceRuleOrigin = components['schemas']['ResourceRuleOrigin']
type ResourceMeta = components['schemas']['Meta']
type PartialOrigin = ResourceRuleOrigin | ResourceMeta

export const Origin = {
  fromObject(origin: PartialOrigin, resources: KumaResourceTypeDescriptorCollection) {
    const hasResourceMeta = (o: PartialOrigin): o is ResourceRuleOrigin => 'resourceMeta' in o
    const {
      type = '',
      mesh = '',
      name = '',
      labels = {},
    } = (hasResourceMeta(origin) ? origin.resourceMeta : origin) ?? {}

    return {
      ...origin,
      type,
      mesh,
      name,
      labels,
      kri: (() => {
        if('kri' in origin) return String(origin.kri)

        const shortName = resources.resources.find((resource) => resource.name === type)?.shortName || `~${type.toLowerCase()}`
        const zone = labels['kuma.io/origin'] === 'zone' ? labels['kuma.io/zone'] ?? '' : ''
        const namespace = labels['k8s.kuma.io/namespace'] ?? ''
        const displayName = labels['kuma.io/display-name'] ?? name
        return Kri.toString({ shortName, mesh, zone, namespace, name: displayName })
      })(),
    }
  },
}
