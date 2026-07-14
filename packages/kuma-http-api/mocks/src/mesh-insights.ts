import type { Dependencies, ResponseHandler } from '#mocks'
export default ({ fake, pager, env }: Dependencies): ResponseHandler => (req) => {
  const query = req.url.searchParams
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_MESH_COUNT', `${fake.number.int({ min: 1, max: 20 })}`),
    req,
    '/mesh-insights',
  )
  const isMtlsEnabled = env('KUMA_MTLS_ENABLED', `${fake.datatype.boolean()}`) === 'true'
  const meshIdentityCount = parseInt(env('KUMA_MESHIDENTITY_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))

  const nameQuery = query.get('name')

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const name = id === 0 ? 'default' : `${nameQuery?.padEnd(nameQuery.length + 1, '-') ?? ''}${fake.word.noun()}-${id}`

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

        return {
          type: 'MeshInsight',
          name,
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
            CircuitBreaker: fake.kuma.policyTypeStatus(),
            FaultInjection: fake.kuma.policyTypeStatus(),
            HealthCheck: fake.kuma.policyTypeStatus(),
            MeshGatewayRoute: fake.kuma.policyTypeStatus(),
            MeshGateway: fake.kuma.policyTypeStatus(),
            ProxyTemplate: fake.kuma.policyTypeStatus(),
            RateLimit: fake.kuma.policyTypeStatus(),
            Retry: fake.kuma.policyTypeStatus(),
            Timeout: fake.kuma.policyTypeStatus(),
            TrafficLog: fake.kuma.policyTypeStatus(),
            TrafficPermission: fake.kuma.policyTypeStatus(),
            TrafficRoute: fake.kuma.policyTypeStatus(),
            TrafficTrace: fake.kuma.policyTypeStatus(),
            VirtualOutbound: fake.kuma.policyTypeStatus(),
            Secret: fake.kuma.policyTypeStatus(),
          },
          resources: {
            ...Object.fromEntries(fake.kuma.resourceNames(resourceCount).map((name) => [name, { total: fake.number.int({ min: 0, max: 20 }) }])),
          },
          dpVersions: {
            kumaDp: {
              '1.0.4': {
                total: 3,
                online: 2,
              },
              '1.0.0-rc2': {
                total: 1,
                online: 1,
              },
              '1.0.6': {
                total: 2,
                online: 1,
              },
            },
            envoy: {
              '1.16.2': {
                total: 4,
                online: 1,
              },
              '1.14.0': {
                total: 7,
                online: 1,
              },
              '1.16.1': {
                total: 8,
                online: 1,
              },
            },
          },
          mTLS: (() => {
            if(!isMtlsEnabled) return {}

            // Each mesh-identity has a corresponding mesh-trust sharing the same
            // kri sections (mesh, zone, namespace, name) — only the shortName differs.
            const mtlsMidBackends = Array.from({ length: meshIdentityCount }, (_, j) => ({
              mesh: name,
              zone: fake.helpers.arrayElement(['', fake.word.noun()]),
              namespace: fake.helpers.arrayElement(['', fake.word.noun()]),
              displayName: fake.word.noun(),
            }))
            const mtlsBackends = fake.helpers.arrayElements(['ca-1', 'ca-2', 'ca-3'])
            const dpStats = () => {
              const { total, online } = fake.kuma.partitionInto({ total: dataplanesTotal, online: Number, offline: Number }, dataplanesTotal)
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
        }
      }),
      next,
    },
  }
}
