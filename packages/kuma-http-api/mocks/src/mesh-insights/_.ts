import type { Dependencies, ResponseHandler } from '#mocks'

export default ({ env, fake }: Dependencies): ResponseHandler => (req) => {
  const params = req.params

  const resourceCount = parseInt(env('KUMA_ACTIVE_RESOURCE_COUNT', `${Number.MAX_SAFE_INTEGER}`))
  const serviceTotal = parseInt(env('KUMA_SERVICE_COUNT', `${fake.number.int({ min: 1, max: 30 })}`))
  const max = env('KUMA_DATAPLANE_COUNT', '30') === '0' ? 0 : 30

  const { standard, gatewayBuiltin, gatewayDelegated } = fake.kuma.partitionInto({
    standard: Number,
    gatewayBuiltin: Number,
    gatewayDelegated: Number,
  }, max)

  const gatewaysTotal = gatewayBuiltin + gatewayDelegated
  const gateway = fake.kuma.partitionInto({
    total: gatewaysTotal,
    online: Number,
    partiallyDegraded: Number,
    offline: Number,
  }, gatewaysTotal)

  const dataplanesTotal = standard + gateway.total
  const dataplanes = fake.kuma.partitionInto({
    total: dataplanesTotal,
    online: Number,
    partiallyDegraded: Number,
    offline: Number,
  }, dataplanesTotal)

  const dpTotal = dataplanes.online + dataplanes.partiallyDegraded
  const totalVersions = fake.kuma.partition(1, dpTotal, 5, dpTotal)

  return {
    headers: {},
    body: {
      type: 'MeshInsight',
      name: params.mesh,
      creationTime: '2021-01-29T07:10:02.339031+01:00',
      modificationTime: '2021-01-29T07:29:02.314448+01:00',
      lastSync: '2021-01-29T06:29:02.314447Z',
      dataplanes,
      dataplanesByType: {
        standard,
        gateway,
        gatewayBuiltin,
        gatewayDelegated,
      },
      policies: {
        ...fake.kuma.policyNames().reduce((prev: Record<string, { total: number }>, item) => {
          prev[item] = {
            total: fake.number.int(20),
          }
          return prev
        }, {}),
      },
      resources: {
        ...Object.fromEntries(fake.kuma.resourceNames(resourceCount).map((name) => [name, { total: fake.number.int({ min: 0, max: 20 })}])),
      },
      dpVersions: {
        kumaDp: {
          ...fake.helpers.uniqueArray(fake.system.semver, totalVersions.length).reduce((prev: Record<string, { total: number, online: number }>, item, i) => {
            prev[item] = {
              total: totalVersions[i],
              online: fake.number.int(totalVersions[i]),
            }
            return prev
          }, {}),
        },
        envoy: {
          ...fake.helpers.uniqueArray(fake.system.semver, totalVersions.length).reduce((prev: Record<string, { total: number, online: number }>, item, i) => {
            prev[item] = {
              total: totalVersions[i],
              online: fake.number.int(totalVersions[i]),
            }
            return prev
          }, {}),
        },
      },
      mTLS: {
        issuedBackends: {
          ...['ca-2', 'ca-1'].reduce((prev: Record<string, { total: number, online?: number }>, item) => {
            prev[item] = {
              total: fake.number.int(10),
            }
            prev[item].online = fake.number.int(prev[item].total)
            return prev
          }, {}),
        },
        supportedBackends: {
          ...['ca-2', 'ca-1'].reduce((prev: Record<string, { total: number, online?: number }>, item) => {
            prev[item] = {
              total: fake.number.int(10),
            }
            prev[item].online = fake.number.int(prev[item].total)
            return prev
          }, {}),
        },
      },
      services: {
        total: serviceTotal,
        ...fake.kuma.partitionInto({
          internal: Number,
          external: Number,
        }, serviceTotal),
      },
    },
  }
}
