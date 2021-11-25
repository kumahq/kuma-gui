import { humanReadableDate } from '@/helpers'
import { ONLINE, OFFLINE, PARTIALLY_DEGRADED, KUMA_ZONE_TAG_NAME } from '@/consts'
import { satisfies } from 'semver'
import Kuma from '@/services/kuma'
import { Dataplane, TagsPairLabelValue, DataplaneInsight, DataplaneOverview, DiscoverySubscription } from '@/types'

/*
dpTags takes a Dataplane received from backend and construct the list of tags in form of array of objects with label and value.
It flattens common tags so we don't display them twice.

Takes a Dataplane received from backend and construct the list of tags in form of array of objects with label and value.
It flattens common tags so we don't display them twice.
@example

type: Dataplane
mesh: default
name: cluster-1.ingress-01
networking:
  inbound:
    - port: 1234
      tags:
        kuma.io/service: backend
        version: 1
    - port: 1235
      tags:
        kuma.io/service: backend-api
        version: 1

Will produce:
[
  { label: 'kuma.io/service', value: 'backend'},
  { label: 'kuma.io/service', value: 'backend-api'},
  { label: 'version', value: '1'},
]
 */

type TODO = any

export function dpTags(dataplane: Dataplane): TagsPairLabelValue[] {
  let tags: TODO[] = []

  const inbounds = dataplane.networking.inbound || null
  if (inbounds) {
    tags = inbounds.flatMap(inbound => Object.entries(inbound.tags)).map(([key, value]) => `${key}=${value}`)
  }

  // gateway data plane has no inbounds, but has tags embedded in gateway branch
  const gateway = dataplane.networking.gateway || null
  if (gateway) {
    tags = Object.entries(gateway.tags).map(([key, value]) => `${key}=${value}`)
  }

  tags = Array.from(new Set(tags)) // remove duplicates

  return tags
    .map(tagPair => tagPair.split('='))
    .map(([key, value]) => ({
      label: key,
      value: value,
    }))
}

/*
getStatus takes Dataplane and DataplaneInsight and returns the status 'Online' or 'Offline'
 */
export function getStatus(dataplane: Dataplane, dataplaneInsight: DataplaneInsight = { subscriptions: [] }) {
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

export function getVersions(dataplaneInsight: DataplaneInsight): Record<string, string> | null {
  if (!dataplaneInsight.subscriptions.length) {
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

export function getDataplane(dataplaneOverview: DataplaneOverview) {
  const { name, mesh, type } = dataplaneOverview

  return {
    name: name,
    mesh: mesh,
    type: type,
    ...dataplaneOverview.dataplane,
  }
}

export function getDataplaneInsight(dataplaneOverview: DataplaneOverview) {
  const { name, mesh, type } = dataplaneOverview

  return {
    name: name,
    mesh: mesh,
    type: type,
    ...dataplaneOverview.dataplaneInsight,
  }
}

export async function checkKumaDpAndZoneVersionsMismatch(tags: TagsPairLabelValue[], dpVersion: string) {
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
            kumaDpVersion: dpVersion,
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

export function parseMTLSData(mtls: TODO) {
  const rawExpDate = new Date(mtls.certificateExpirationTime)
  // this prevents any weird date shifting
  const fixedExpDate = new Date(rawExpDate.getTime() + rawExpDate.getTimezoneOffset() * 60000)
  // assembled to display date and time (in 24-hour format)
  const assembledExpDate = `
                      ${fixedExpDate.toLocaleDateString(
                        'en-US',
                      )} ${fixedExpDate.getHours()}:${fixedExpDate.getMinutes()}:${fixedExpDate.getSeconds()}
                    `

  return {
    certificateExpirationTime: {
      label: 'Expiration Time',
      value: assembledExpDate,
    },
    lastCertificateRegeneration: {
      label: 'Last Generated',
      value: humanReadableDate(mtls.lastCertificateRegeneration),
    },
    certificateRegenerations: {
      label: 'Regenerations',
      value: mtls.certificateRegenerations,
    },
  }
}

export function getDataplaneType(dataplane: { networking: { gateway?: TODO } } = { networking: {} }) {
  const { networking = {} } = dataplane
  const { gateway } = networking

  if (gateway) {
    return 'Gateway'
  }

  return 'Standard'
}

export function checkVersionsCompatibility(
  supportedVersions: { kumaDp?: TODO } = {},
  kumaDpVersion = '',
  envoyVersion = '',
) {
  const { kumaDp } = supportedVersions

  if (!kumaDp) {
    return { kind: INCOMPATIBLE_WRONG_FORMAT }
  }

  const versionKeys = Object.keys(kumaDp)
  let requirements: TODO = kumaDp[kumaDpVersion]

  if (!requirements) {
    for (let i = 0; i < versionKeys.length; i++) {
      const currentVersion = versionKeys[i]

      if (satisfies(kumaDpVersion, currentVersion)) {
        requirements = kumaDp[currentVersion]

        break
      }
    }
  }

  if (!requirements) {
    return {
      kind: INCOMPATIBLE_UNSUPPORTED_KUMA_DP,
      payload: { kumaDpVersion },
    }
  }

  if (!requirements.envoy) {
    return { kind: INCOMPATIBLE_WRONG_FORMAT }
  }

  const kind = satisfies(envoyVersion, requirements.envoy) ? COMPATIBLE : INCOMPATIBLE_UNSUPPORTED_ENVOY

  const payload = {
    envoy: envoyVersion,
    kumaDp: kumaDpVersion,
    requirements: requirements.envoy,
  }

  return {
    kind,
    payload,
  }
}

export const COMPATIBLE = 'COMPATIBLE'
export const INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS = 'INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS'
export const INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS = 'INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS'
export const INCOMPATIBLE_UNSUPPORTED_KUMA_DP = 'INCOMPATIBLE_UNSUPPORTED_KUMA_DP'
export const INCOMPATIBLE_UNSUPPORTED_ENVOY = 'INCOMPATIBLE_UNSUPPORTED_ENVOY'
export const INCOMPATIBLE_WRONG_FORMAT = 'INCOMPATIBLE_WRONG_FORMAT'
