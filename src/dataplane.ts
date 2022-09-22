import { humanReadableDate } from '@/helpers'
import { ONLINE, OFFLINE, PARTIALLY_DEGRADED, KUMA_ZONE_TAG_NAME } from '@/consts'
import Kuma from '@/services/kuma'
import {
  Compatibility,
  DataPlaneEntityMtls,
  DataPlaneInsight,
  DataPlaneNetworking,
  DataPlaneOverview,
  DataPlaneStatus,
  DiscoverySubscription,
  LabelValue,
  Version,
} from '@/types'

type TODO = any

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

/*
getStatus takes Dataplane and DataplaneInsight and returns the status 'Online' or 'Offline'
 */
export function getStatus(dataplane: { networking: DataPlaneNetworking }, dataplaneInsight: DataPlaneInsight = { subscriptions: [] }): { status: DataPlaneStatus, reason: string[] } {
  const inbounds: TODO = dataplane.networking.inbound ? dataplane.networking.inbound : [{ health: { ready: true } }]

  const errors = inbounds
    .filter((item: TODO) => item.health && !item.health.ready)
    .map((item: TODO) => `Inbound on port ${item.port} is not ready (kuma.io/service: ${item.tags['kuma.io/service']})`)

  const subscriptions = dataplaneInsight.subscriptions ? dataplaneInsight.subscriptions : []

  const proxyOnline = subscriptions.some(
    (item: TODO) => item.connectTime && item.connectTime.length && !item.disconnectTime,
  )

  const status = () => {
    const allInboundsOffline = errors.length === inbounds.length
    const allInboundsOnline = errors.length === 0

    if (!proxyOnline || allInboundsOffline) {
      return OFFLINE
    }

    if (!allInboundsOnline) {
      return PARTIALLY_DEGRADED
    }

    return ONLINE
  }

  return {
    status: status(),
    reason: errors,
  }
}

/*
getStatus takes DataplaneInsight and returns map of versions
 */

export function getVersions(dataplaneInsight: DataPlaneInsight): Record<string, string> | null {
  if (!dataplaneInsight.subscriptions?.length) {
    return null
  }

  const versions: Record<string, string> = {}

  const lastSubscription: DiscoverySubscription =
    dataplaneInsight.subscriptions[dataplaneInsight.subscriptions.length - 1]

  if (lastSubscription.version?.envoy) {
    versions.envoy = lastSubscription.version.envoy.version
  }

  if (lastSubscription.version?.kumaDp) {
    versions.kumaDp = lastSubscription.version.kumaDp.version
  }

  if (lastSubscription.version?.dependencies) {
    Object.entries(lastSubscription.version.dependencies).forEach(([key, value]) => {
      versions[key] = value
    })
  }

  return versions
}

/*
getItemStatusFromInsight takes object with subscriptions and returns the status 'Online' or 'Offline'
 */
export function getItemStatusFromInsight(item: TODO = {}): { status: typeof ONLINE | typeof OFFLINE } {
  const { subscriptions = [] } = item

  const proxyOnline = subscriptions.some(
    (item: TODO) => item.connectTime && item.connectTime.length && !item.disconnectTime,
  )

  const status = () => {
    if (proxyOnline) {
      return ONLINE
    }

    return OFFLINE
  }

  return {
    status: status(),
  }
}

export async function checkKumaDpAndZoneVersionsMismatch(tags: LabelValue[], dpVersion: string) {
  const tag = tags.find(tag => tag.label === KUMA_ZONE_TAG_NAME)

  if (tag) {
    try {
      const response = (await Kuma.getZoneOverview({ name: tag.value })) || {}
      const { zoneInsight = {} } = response
      const { subscriptions = [] } = zoneInsight

      if (subscriptions.length) {
        const { version = {} } = subscriptions[subscriptions.length - 1]
        const { kumaCp = {} } = version

        return {
          compatible: dpVersion === kumaCp.version,
          payload: {
            zoneVersion: kumaCp.version,
            kumaDp: dpVersion,
          },
        }
      }

      return { compatible: true }
    } catch (e) {
      console.error(e)
    }
  }

  return { compatible: true }
}

export function parseMTLSData(dataPlaneOverview: DataPlaneOverview): DataPlaneEntityMtls | null {
  const { mTLS } = dataPlaneOverview.dataplaneInsight

  if (mTLS === undefined) {
    return null
  }

  const rawExpDate = new Date(mTLS.certificateExpirationTime)
  // this prevents any weird date shifting
  const fixedExpDate = new Date(rawExpDate.getTime() + rawExpDate.getTimezoneOffset() * 60000)
  // assembled to display date and time (in 24-hour format)
  const assembledExpDate = `${fixedExpDate.toLocaleDateString('en-US')} ${fixedExpDate.getHours()}:${fixedExpDate.getMinutes()}:${fixedExpDate.getSeconds()}`

  return {
    certificateExpirationTime: {
      label: 'Expiration Time',
      value: assembledExpDate,
    },
    lastCertificateRegeneration: {
      label: 'Last Generated',
      value: humanReadableDate(mTLS.lastCertificateRegeneration),
    },
    certificateRegenerations: {
      label: 'Regenerations',
      value: mTLS.certificateRegenerations,
    },
  }
}

/**
 * @returns `'Standard' | 'Gateway' | 'Gateway (builtin)' | 'Gateway (provided)'`
 */
export function getDataplaneType(dataplane: { networking: DataPlaneNetworking }): string {
  const { gateway } = dataplane.networking

  if (gateway) {
    return 'Gateway' + (gateway.type !== undefined ? ` (${gateway.type})` : '')
  } else {
    return 'Standard'
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
