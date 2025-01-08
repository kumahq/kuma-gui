import type { ApiKindListResponse } from '@/types/api.d'
import type {
  LabelValue,
  MatchedPolicyType,
  PolicyTypeEntry,
  PolicyTypeEntryConnection,
  SidecarDataplane as PartialSidecarDataplane,
} from '@/types/index.d'

export type SidecarDataplane = PartialSidecarDataplane
export const SidecarDataplane = {
  fromCollection(partialSidecarDataplanes: ApiKindListResponse<PartialSidecarDataplane>): ApiKindListResponse<SidecarDataplane> & { policyTypeEntries: PolicyTypeEntry[] } {
    const items = Array.isArray(partialSidecarDataplanes.items) ? partialSidecarDataplanes.items : []
    const policyTypeEntries = getPolicyTypeEntries(items)

    return {
      ...partialSidecarDataplanes,
      items,
      policyTypeEntries,
    }
  },
}
/**
 * Transforms `SidecarDataplane` objects into policy type entries which are going to be displayed in this view.
 */
function getPolicyTypeEntries(sidecarDataplanes: PartialSidecarDataplane[]): PolicyTypeEntry[] {
  // Uses a `Map` to store entries by type so they can be retrieved and updated while iterating over the `SidecarDataplane` objects.
  const policyTypeEntriesByType = new Map<string, PolicyTypeEntry>()

  for (const sidecarDataplane of sidecarDataplanes) {
    const { type, service } = sidecarDataplane

    // The `service` field, when set, represents the name of the destination service of traffic.
    const destinationTags: LabelValue[] = typeof service === 'string' && service !== '' ? [{ label: 'kuma.io/service', value: service }] : []
    const name = type === 'inbound' || type === 'outbound' ? sidecarDataplane.name : null

    for (const [policyTypeName, policies] of Object.entries(sidecarDataplane.matchedPolicies)) {
      if (!policyTypeEntriesByType.has(policyTypeName)) {
        policyTypeEntriesByType.set(policyTypeName, {
          type: policyTypeName,
          connections: [],
        })
      }

      const policyTypeEntry = policyTypeEntriesByType.get(policyTypeName)!

      for (const policy of policies) {
        const connections = getPolicyTypeEntryConnections(policy, sidecarDataplane, destinationTags, name)

        policyTypeEntry.connections.push(...connections)
      }
    }
  }

  const policyTypeEntries = Array.from(policyTypeEntriesByType.values())

  policyTypeEntries.sort((policyTypeEntryA, policyTypeEntryB) => policyTypeEntryA.type.localeCompare(policyTypeEntryB.type))

  return policyTypeEntries
}
function getPolicyTypeEntryConnections(policy: MatchedPolicyType, sidecarDataplane: SidecarDataplane, destinationTags: LabelValue[], name: string | null): PolicyTypeEntryConnection[] {
  const config = policy.conf && Object.keys(policy.conf).length > 0 ? policy.conf : undefined
  const origins = [{
    name: policy.name,
    mesh: policy.mesh,
    type: policy.type,
  }]

  const policyTypeEntryConnections: PolicyTypeEntryConnection[] = []

  if (sidecarDataplane.type === 'inbound' && Array.isArray(policy.sources)) {
    for (const { match } of policy.sources) {
      const sourceTags: LabelValue[] = [{ label: 'kuma.io/service', value: match['kuma.io/service'] }]
      // FIXME: below ts error
      // @ts-expect-error type mismatch config and policy.conf: {} vs string. PolicyTypeEntryConnection expects config as string | undefined
      const connection: PolicyTypeEntryConnection = { sourceTags, destinationTags, name, config, origins }

      policyTypeEntryConnections.push(connection)
    }
  } else {
    const sourceTags: LabelValue[] = []
    // FIXME: below ts error
    // @ts-expect-error type mismatch config and policy.conf: {} vs string. PolicyTypeEntryConnection expects config as string | undefined
    const connection: PolicyTypeEntryConnection = { sourceTags, destinationTags, name, config, origins }

    policyTypeEntryConnections.push(connection)
  }

  return policyTypeEntryConnections
}
