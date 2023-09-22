import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const policyTypes = [
    'CircuitBreaker',
    'FaultInjection',
    'HealthCheck',
    'MeshGatewayRoute',
    'MeshGateway',
    'ProxyTemplate',
    'RateLimit',
    'Retry',
    'Timeout',
    'TrafficLog',
    'TrafficPermission',
    'TrafficRoute',
    'TrafficTrace',
    'VirtualOutbound',
  ]

  const standard = fake.kuma.healthStatus()
  const gatewayBuiltin = fake.kuma.healthStatus()
  const gatewayDelegated = fake.kuma.healthStatus()
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
        ...policyTypes.reduce((prev: Record<string, { total: number }>, item) => {
          if (fake.datatype.boolean()) {
            prev[item] = {
              total: fake.number.int(20),
            }
          }
          return prev
        }, {}),
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
      services: fake.kuma.serviceStatus(),
    },
  }
}
