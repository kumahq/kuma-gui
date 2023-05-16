import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  // TODO: Setting different values here doesn’t seem to work. The mock always returns 14 objects.
  const { total, next, pageTotal } = pager(
    env('KUMA_MESH_COUNT', `${fake.number.int({ min: 1, max: 20 })}`),
    req,
    '/mesh-insights',
  )

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const mesh = `${fake.hacker.noun()}-${i}`
        const dataPlaneProxyStatus = fake.kuma.dataPlaneProxyStatus()
        const standardDataPlaneProxies = fake.kuma.dataPlaneProxyStatus(dataPlaneProxyStatus.total)
        const gateways = fake.kuma.dataPlaneProxyStatus(standardDataPlaneProxies.total)

        return {
          type: 'MeshInsight',
          name: mesh,
          creationTime: '2021-01-29T07:10:02.339031+01:00',
          modificationTime: '2021-01-29T07:29:02.314448+01:00',
          lastSync: '2021-01-29T06:29:02.314447Z',
          dataplanes: dataPlaneProxyStatus,
          dataplanesByType: {
            standard: standardDataPlaneProxies,
            gateway: gateways,
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
