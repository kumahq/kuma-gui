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
    .map(([key, value]) => ({
      label: key,
      value: value
    }))
}

/*
getStatus takes Dataplane and DataplaneInsight and returns the status 'Online' or 'Offline'
 */
export function getStatus (dataplane, dataplaneInsight) {
  const inbounds = dataplane.networking.inbound
    ? dataplane.networking.inbound
    : [{ health: { ready: true } }]

  const errors = inbounds
    .filter(item => item.health && !item.health.ready)
    .map(item => `Inbound on port ${item.port} is not ready (kuma.io/service: ${item.tags['kuma.io/service']})`)

  const subscriptions = dataplaneInsight.subscriptions
    ? dataplaneInsight.subscriptions
    : []

  const proxyOnline = subscriptions
    .some(item => item.connectTime && item.connectTime.length && !item.disconnectTime)

  const status = () => {
    const allInboundsOffline = errors.length === inbounds.length
    const allInboundsOnline = errors.length === 0

    if (!proxyOnline || allInboundsOffline) {
      return 'Offline'
    }

    if (!allInboundsOnline) {
      return 'Partially degraded'
    }

    return 'Online'
  }

  return {
    status: status(),
    reason: errors,
  }
}

export function getDataplane (dataplaneOverview) {
  const { name, mesh, type } = dataplaneOverview

  return {
    name: name,
    mesh: mesh,
    type: type,
    ...dataplaneOverview.dataplane,
  }
}

export function getDataplaneInsight (dataplaneOverview) {
  const { name, mesh, type } = dataplaneOverview

  return {
    name: name,
    mesh: mesh,
    type: type,
    ...dataplaneOverview.dataplaneInsight,
  }
}
