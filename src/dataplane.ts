import { humanReadableDate } from '@/helpers'
import { ONLINE, OFFLINE, PARTIALLY_DEGRADED } from '@/consts'
import { satisfies } from 'semver'
import Kuma from '@/services/kuma'

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
interface DataPlane {
  networking: {
    inbound: {
      port: number
      tags: Record<string, string>
      health?: { ready: boolean }
    }[]
    gateway: TODO
  }
}

export function dpTags(dataplane: DataPlane): { label: string; value: string }[] {
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
export function getStatus(dataplane: DataPlane, dataplaneInsight: TODO = {}) {
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

interface DataPlaneOverview {
  name: string
  mesh: string
  type: string
  dataplane: DataPlane
  dataplaneInsight: TODO
}

export function getDataplane(dataplaneOverview: DataPlaneOverview) {
  const { name, mesh, type } = dataplaneOverview

  return {
    name: name,
    mesh: mesh,
    type: type,
    ...dataplaneOverview.dataplane,
  }
}

export function getDataplaneInsight(dataplaneOverview: DataPlaneOverview) {
  const { name, mesh, type } = dataplaneOverview

  return {
    name: name,
    mesh: mesh,
    type: type,
    ...dataplaneOverview.dataplaneInsight,
  }
}

export async function checkKumaDpAndZoneVersionsMismatch(zoneName: string, dpVersion: string) {
  const response = (await Kuma.getZoneOverview(zoneName)) || {}
  const { zoneInsight = {} } = response
  const { subscriptions = [] } = zoneInsight

  if (subscriptions.length) {
    const { version = {} } = subscriptions.pop()
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

export function getDataplaneType(dataplane: { networking: { gateway?: TODO; ingress?: TODO } } = { networking: {} }) {
  const { networking = {} } = dataplane
  const { gateway, ingress } = networking

  if (gateway) {
    return 'Gateway'
  }

  if (ingress) {
    return 'Ingress'
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
