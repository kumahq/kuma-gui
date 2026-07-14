import type { Dependencies, ResponseHandler } from '#mocks'
import type { paths } from '@kumahq/kuma-http-api'
type MeshInsightResponse = paths['/mesh-insights/{name}']['get']['responses']['200']['content']['application/json']

export default ({ env, fake }: Dependencies): ResponseHandler => (req) => {
  const params = req.params
  const mesh = String(params.mesh)

  const resourceCount = parseInt(env('KUMA_ACTIVE_RESOURCE_COUNT', `${Number.MAX_SAFE_INTEGER}`))
  const serviceTotal = parseInt(env('KUMA_SERVICE_COUNT', `${fake.number.int({ min: 1, max: 30 })}`))
  const max = env('KUMA_DATAPLANE_COUNT', '30') === '0' ? 0 : 30
  const isMtlsEnabled = env('KUMA_MTLS_ENABLED', `${fake.datatype.boolean()}`) === 'true'
  const meshIdentityCount = parseInt(env('KUMA_MESHIDENTITY_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))

  // split the count into types
  const { standardTotal, gatewayBuiltinTotal, gatewayDelegatedTotal } = fake.kuma.partitionInto({
    standardTotal: Number,
    gatewayBuiltinTotal: Number,
    gatewayDelegatedTotal: Number,
  }, max)

  // dp types
  const standard = fake.kuma.partitionInto({
    total: standardTotal,
    online: Number,
    partiallyDegraded: Number,
    offline: Number,
  }, standardTotal)

  const gatewayBuiltin = fake.kuma.partitionInto({
    total: gatewayBuiltinTotal,
    online: Number,
    partiallyDegraded: Number,
    offline: Number,
  }, gatewayBuiltinTotal)

  const gatewayDelegated = fake.kuma.partitionInto({
    total: gatewayDelegatedTotal,
    online: Number,
    partiallyDegraded: Number,
    offline: Number,
  }, gatewayDelegatedTotal)
  //

  // aggregations of types/categories
  const gateway = {
    total: gatewayBuiltin.total + gatewayDelegated.total,
    online: gatewayBuiltin.online + gatewayDelegated.online,
    partiallyDegraded: gatewayBuiltin.partiallyDegraded + gatewayDelegated.partiallyDegraded,
    offline: gatewayBuiltin.offline + gatewayDelegated.offline,
  }
  const dataplanes = {
    total: standard.total + gatewayBuiltin.total + gatewayDelegated.total,
    online: standard.online + gatewayBuiltin.online + gatewayDelegated.online,
    partiallyDegraded: standard.partiallyDegraded + gatewayBuiltin.partiallyDegraded + gatewayDelegated.partiallyDegraded,
    offline: standard.offline + gatewayBuiltin.offline + gatewayDelegated.offline,
  }
  //

  const dpTotal = dataplanes.online + dataplanes.partiallyDegraded
  const totalVersions = fake.kuma.partition(1, dpTotal, 5, dpTotal)

  return {
    headers: {},
    body: {
      type: 'MeshInsight',
      name: mesh,
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
      mTLS: (() => {
        if(!isMtlsEnabled) return {}

        // Each mesh-identity has a corresponding mesh-trust sharing the same
        // kri sections (mesh, zone, namespace, name) — only the shortName differs.
        const mtlsMidBackends = Array.from({ length: meshIdentityCount }, (_, j) => ({
          mesh,
          zone: fake.helpers.arrayElement(['', fake.word.noun()]),
          namespace: fake.helpers.arrayElement(['', fake.word.noun()]),
          displayName: fake.word.noun(),
        }))
        const mtlsBackends = fake.helpers.arrayElements(['ca-1', 'ca-2', 'ca-3'])
        const dpStats = () => {
          const { total, online } = fake.kuma.partitionInto({ total: dpTotal, online: Number, offline: Number }, dpTotal)
          return {
            total,
            online,
          }
        }

        return {
          issuedBackends: Object.fromEntries(
            mtlsMidBackends.length > 0 ?
              mtlsMidBackends.map((sections) => [fake.kuma.kri({ resourceName: 'MeshIdentity', ...sections, sectionName: '' }), dpStats()]) :
              mtlsBackends.map((backend) => [backend, dpStats()]),
          ),
          supportedBackends: Object.fromEntries(
            mtlsMidBackends.length > 0 ?
              mtlsMidBackends.map((sections) => [fake.kuma.kri({ resourceName: 'MeshTrust', ...sections, sectionName: '' }), dpStats()]) :
              mtlsBackends.map((backend) => [backend, dpStats()]),
          ),
        }
      })(),
      services: {
        total: serviceTotal,
        ...fake.kuma.partitionInto({
          internal: Number,
          external: Number,
        }, serviceTotal),
      },
    } satisfies MeshInsightResponse,
  }
}
