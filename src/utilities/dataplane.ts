import {
  Compatibility,
  DataPlaneInsight,
  DataPlaneNetworking,
  DataPlaneOverview,
  DiscoverySubscription,
  KDSSubscription,
  LabelValue,
  StatusKeyword,
  Version,
} from '@/types/index.d'

/**
 * Takes a data plane and constructs the list of tags. It removes duplicate tags so we don't display them twice. Note that tags are only considered a duplicate if both their key and their value are the same.
 *
 * **Example**:
 *
 * Data plane:
 *
 * ```yaml
 * type: Dataplane
 * mesh: default
 * name: cluster-1.ingress-01
 * networking:
 *   inbound:
 *     - port: 1234
 *       tags:
 *         kuma.io/service: backend
 *         version: 1
 *     - port: 1235
 *       tags:
 *         kuma.io/service: backend-api
 *         version: 1
 * ```
 *
 * Output:
 *
 * ```js
 * [
 *   { label: 'kuma.io/service', value: 'backend'},
 *   { label: 'kuma.io/service', value: 'backend-api'},
 *   { label: 'version', value: '1'},
 * ]
 * ```
 */
export function dpTags(dataplane: { networking: DataPlaneNetworking }): LabelValue[] {
  let tags: string[] = []

  if (dataplane.networking.inbound) {
    tags = dataplane.networking.inbound
      .filter((inbound) => 'tags' in inbound)
      .flatMap((inbound) => Object.entries(inbound.tags))
      .map(([key, value]) => `${key}=${value}`)
  }

  if (dataplane.networking.gateway) {
    // gateway data plane has no inbounds, but has tags embedded in gateway branch
    tags = Object.entries(dataplane.networking.gateway.tags).map(([key, value]) => `${key}=${value}`)
  }

  const uniqueTags = Array.from(new Set(tags))

  uniqueTags.sort((tagPairA, tagPairB) => tagPairA.localeCompare(tagPairB))

  return uniqueTags
    .map((tagPair) => tagPair.split('='))
    .map(([label, value]) => ({ label, value }))
}

// getItemStatusFromInsight takes object with subscriptions and returns a
// status 'online' | 'offline'
export function getItemStatusFromInsight(insight: { subscriptions?: DiscoverySubscription[] | KDSSubscription[] } | undefined = { subscriptions: [] }): StatusKeyword {
  const proxyOnline = (insight.subscriptions ?? []).some((subscription) => subscription.connectTime?.length && !subscription.disconnectTime)
  return proxyOnline ? 'online' : 'offline'
}

// getStatusAndReason takes Dataplane and DataplaneInsight and returns a
// {status: 'online' | 'offline' | 'partially_degraded', reason: errors[]}
export function getStatusAndReason(dataplane: { networking: DataPlaneNetworking }, insight: { subscriptions?: DiscoverySubscription[] } | undefined = { subscriptions: [] }): { status: StatusKeyword, reason: string[] } {
  const inbound = dataplane.networking.inbound ?? []
  const errors = inbound
    .filter(item => item.health && !item.health.ready)
    .map(item => `Inbound on port ${item.port} is not ready (kuma.io/service: ${item.tags['kuma.io/service']})`)

  let status: StatusKeyword
  switch (true) {
    case inbound.length === 0:
      status = 'online'
      break
    // if errors and inbounds are equal, even if they are both 0
    // then we are offline
    case errors.length === inbound.length:
      status = 'offline'
      break
    // otherwise any errors at all, we are degraded
    case errors.length > 0:
      status = 'partially_degraded'
      break
    default:
      // otherwise run the normal getter
      status = getItemStatusFromInsight(insight)
  }
  return {
    status,
    reason: errors,
  }
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

export function parseMTLSData(dataPlaneOverview: DataPlaneOverview, formatIsoDate: (isoDate: string) => string) {
  if (dataPlaneOverview.dataplaneInsight === undefined || dataPlaneOverview.dataplaneInsight.mTLS === undefined) {
    return null
  }

  const { mTLS } = dataPlaneOverview.dataplaneInsight
  const rawExpDate = new Date(mTLS.certificateExpirationTime)
  // this prevents any weird date shifting
  const fixedExpDate = new Date(rawExpDate.getTime() + rawExpDate.getTimezoneOffset() * 60000)

  return {
    certificateExpirationTime: formatIsoDate(fixedExpDate.toISOString()),
    lastCertificateRegeneration: formatIsoDate(mTLS.lastCertificateRegeneration),
    certificateRegenerations: mTLS.certificateRegenerations,
  }
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
