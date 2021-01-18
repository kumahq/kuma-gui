/*
dpTags takes a Dataplane received from backend and construct the list of tags in form of array of objects with label and value.
It flattens common tags so we don't display them twice.

Example:

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
import { getLastDate, humanReadableDate } from '@/helpers'

export function dpTags (dataplane) {
  let tags = []

  const inbounds = dataplane.networking.inbound || null
  if (inbounds) {
    tags = inbounds.flatMap(inbound => Object.entries(inbound.tags))
      .map(([key, value]) => key + '=' + value)
  }

  // gateway data plane has no inbounds, but has tags embedded in gateway branch
  const gateway = dataplane.networking.gateway || null
  if (gateway) {
    tags = Object.entries(gateway.tags)
      .map(([key, value]) => key + '=' + value)
  }

  tags = Array.from(new Set(tags)) // remove duplicates

  return tags.map(tagPair => tagPair.split('='))
    .map(([key, value]) => ({ label: key, value: value }))
}

const parseSubscriptionStatus = (status) => {
  const result = {
    responsesSent: 0,
    responsesRejected: 0,
  }

  if (!status) {
    return result
  }

  const { total, lastUpdateTime } = status

  if (total) {
    const { responsesSent, responsesRejected } = total

    if (responsesSent) {
      result.responsesSent = parseInt(responsesSent)
    }

    if (responsesRejected) {
      result.responsesRejected = parseInt(responsesRejected)
    }
  }

  if (lastUpdateTime) {
    const updateDate = Date.parse(lastUpdateTime)

    if (!isNaN(updateDate)) {
      result.lastUpdateTime = new Date(updateDate)
    }
  }

  return result
}

const parseSubscriptionVersions = (version) => {
  const versions = {}

  if (version) {
    const { kumaDp, envoy } = version

    if (kumaDp && kumaDp.version) {
      versions.dpVersion = kumaDp.version
    }

    if (envoy && envoy.version) {
      versions.envoyVersion = envoy.version
    }
  }

  return versions
}

const parseSubscriptionTimes = (connectTime, disconnectTime) => {
  const result = {}

  if (disconnectTime) {
    result.disconnectTime = disconnectTime
  }

  if (connectTime) {
    const connectDate = Date.parse(connectTime)

    if (!isNaN(connectDate)) {
      result.connectTime = new Date(connectDate)
    }

    if (!disconnectTime) {
      result.status = 'Online'
    }
  }

  return result
}

export function reduceSubscriptions(subscriptions = []) {
  const initial = {
    totalUpdates: 0,
    totalRejectedUpdates: 0,
    dpVersion: '-',
    envoyVersion: '-',
    status: 'Offline',
    lastConnected: null,
    lastUpdated: null,
  }

  const parsed = subscriptions.map(({ status, connectTime, disconnectTime, version }) => ({
    ...parseSubscriptionStatus(status),
    ...parseSubscriptionVersions(version),
    ...parseSubscriptionTimes(connectTime, disconnectTime),
  }))

  const reduced = parsed.reduce((acc, curr) => {
    const {
      responsesSent,
      responsesRejected,
      connectTime,
      lastUpdateTime,
      ...other
    } = curr

    return {
      totalUpdates: acc.totalUpdates + responsesSent,
      totalRejectedUpdates: acc.totalRejectedUpdates + responsesRejected,
      lastConnected: getLastDate(acc.lastConnected, connectTime),
      lastUpdated: getLastDate(acc.lastUpdated, lastUpdateTime),
      ...other
    }
  }, initial)

  reduced.lastConnected = reduced.lastConnected
    ? humanReadableDate(reduced.lastConnected)
    : 'never'

  reduced.lastUpdated = reduced.lastUpdated
    ? humanReadableDate(reduced.lastUpdated)
    : 'never'

  return reduced
}

export function parseMTLS(mtls) {
  const rawExpDate = new Date(mtls.certificateExpirationTime)
  // this prevents any weird date shifting
  const fixedExpDate = new Date(
    rawExpDate.getTime() +
    rawExpDate.getTimezoneOffset() * 60000,
  )
  // assembled to display date and time (in 24-hour format)
  const assembledExpDate = `
                      ${fixedExpDate.toLocaleDateString('en-US')} ${fixedExpDate.getHours()}:${fixedExpDate.getMinutes()}:${fixedExpDate.getSeconds()}
                    `

  return {
    certificateExpirationTime: {
      label: 'Expiration Time',
      // value: new Date(mtls.certificateExpirationTime).toLocaleDateString('en-US')
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
