import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_MESH_COUNT', `${fake.number.int({ min: 1, max: 20 })}`),
    req,
    '/mesh-insights',
  )

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const name = id === 0 ? 'default' : `${fake.hacker.noun()}-${id}`

        // TODO(jc) refactor this to use the partitioning so we can say how many
        // DATAPLANES we have and get a spread of types totalling that number
        const max = env('KUMA_DATAPLANE_COUNT', '30') === '0' ? 0 : 30
        const standard = fake.kuma.healthStatus({ min: 0, max })
        const gatewayBuiltin = fake.kuma.healthStatus({ min: 0, max })
        const gatewayDelegated = fake.kuma.healthStatus({ min: 0, max })

        const gateway = {
          total: (gatewayBuiltin.total ?? 0) + (gatewayDelegated.total ?? 0),
          online: (gatewayBuiltin.online ?? 0) + (gatewayDelegated.online ?? 0),
          partiallyDegraded: (gatewayBuiltin.partiallyDegraded ?? 0) + (gatewayDelegated.partiallyDegraded ?? 0),
          offline: (gatewayBuiltin.offline ?? 0) + (gatewayDelegated.offline ?? 0),
        }
        const dataplanes = {
          total: (standard.total ?? 0) + (gateway.total ?? 0),
          online: (standard.online ?? 0) + (gateway.online ?? 0),
          partiallyDegraded: (standard.partiallyDegraded ?? 0) + (gateway.partiallyDegraded ?? 0),
          offline: (standard.offline ?? 0) + (gateway.offline ?? 0),
        }
        // end TODO

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
          mTLS: {
            issuedBackends: {
              'ca-2': {
                total: 2,
                online: 2,
              },
              'ca-1': {
                total: 0,
                online: 0,
              },
            },
            supportedBackends: {
              'ca-2': {
                total: 6,
                online: 6,
              },
              'ca-1': {
                total: 6,
                online: 6,
              },
            },
          },
          services: fake.kuma.serviceStatus(),
        }
      }),
      next,
    },
  }
}
