import {
  Compatibility,
  DataPlaneInsight,
  DiscoverySubscription,
  KDSSubscription,
  StatusKeyword,
  Version,
} from '@/types/index.d'

// getItemStatusFromInsight takes object with subscriptions and returns a
// status 'online' | 'offline'
export function getItemStatusFromInsight(insight: { subscriptions?: DiscoverySubscription[] | KDSSubscription[] } | undefined = { subscriptions: [] }): StatusKeyword {
  const proxyOnline = (insight.subscriptions ?? []).some((subscription) => subscription.connectTime?.length && !subscription.disconnectTime)
  return proxyOnline ? 'online' : 'offline'
}

/*
getStatus takes DataplaneInsight and returns map of versions
 */

export function getVersions(dataPlaneInsight: DataPlaneInsight | undefined): Record<string, string> | null {
  const subscriptions = dataPlaneInsight?.subscriptions || []
  if (subscriptions.length === 0) {
    return null
  }

  const versions: Record<string, string> = {}

  const lastSubscription = subscriptions[subscriptions.length - 1]

  if (lastSubscription.version === undefined) {
    return null
  }

  if (lastSubscription.version.envoy) {
    versions.envoy = lastSubscription.version.envoy.version
  }

  if (lastSubscription.version.kumaDp) {
    versions.kumaDp = lastSubscription.version.kumaDp.version
  }

  if (lastSubscription.version.dependencies) {
    Object.entries(lastSubscription.version.dependencies).forEach(([key, value]) => {
      versions[key] = value
    })
  }

  return versions
}

export function compatibilityKind(version: Version): Compatibility {
  const isKumaCpCompatible = version.kumaDp?.kumaCpCompatible ?? true

  if (!isKumaCpCompatible) {
    return {
      kind: INCOMPATIBLE_UNSUPPORTED_KUMA_DP,
      payload: {
        kumaDp: version.kumaDp.version,
      },
    }
  }

  const isKumaDpCompatible = version.envoy?.kumaDpCompatible ?? true

  if (!isKumaDpCompatible) {
    return {
      kind: INCOMPATIBLE_UNSUPPORTED_ENVOY,
      payload: {
        envoy: version.envoy.version,
        kumaDp: version.kumaDp.version,
      },
    }
  }

  return {
    kind: COMPATIBLE,
  }
}

export const COMPATIBLE = 'COMPATIBLE'
export const INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS = 'INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS'
export const INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS = 'INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS'
export const INCOMPATIBLE_UNSUPPORTED_KUMA_DP = 'INCOMPATIBLE_UNSUPPORTED_KUMA_DP'
export const INCOMPATIBLE_UNSUPPORTED_ENVOY = 'INCOMPATIBLE_UNSUPPORTED_ENVOY'
export const INCOMPATIBLE_WRONG_FORMAT = 'INCOMPATIBLE_WRONG_FORMAT'
