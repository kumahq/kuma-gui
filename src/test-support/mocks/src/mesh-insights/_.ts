import type { EndpointDependencies, MockResponder } from '@/test-support/fake'
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

  const gateways = {
    online: fake.datatype.number(10),
    partiallyDegraded: fake.datatype.number(10),
  }
  const sidecars = {
    online: fake.datatype.number(10),
    partiallyDegraded: fake.datatype.number(10),
  }
  const dataPlanes = {
    online: gateways.online + sidecars.online,
    partiallyDegraded: gateways.partiallyDegraded + sidecars.partiallyDegraded,
    totalVersions: [] as number[],
  }
  const services = 10
  const dpTotal = dataPlanes.online + dataPlanes.partiallyDegraded

  dataPlanes.totalVersions = fake.kuma.partition(1, dpTotal, 5, dpTotal)
  return {
    headers: {},
    body: {
      type: 'MeshInsight',
      name: params.mesh,
      creationTime: '2021-01-29T07:10:02.339031+01:00',
      modificationTime: '2021-01-29T07:29:02.314448+01:00',
      lastSync: '2021-01-29T06:29:02.314447Z',
      dataplanes: {
        total: dataPlanes.online + dataPlanes.partiallyDegraded,
        online: dataPlanes.online,
        partiallyDegraded: dataPlanes.partiallyDegraded,
      },
      dataplanesByType: {
        standard: {
          total: sidecars.online + sidecars.partiallyDegraded,
          online: sidecars.online,
          partiallyDegraded: sidecars.partiallyDegraded,
        },
        gateway: {
          total: gateways.online + gateways.partiallyDegraded,
          online: gateways.online,
          partiallyDegraded: gateways.partiallyDegraded,
        },
      },
      policies: {
        ...policyTypes.reduce((prev: Record<string, { total: number }>, item) => {
          if (fake.datatype.boolean()) {
            prev[item] = {
              total: fake.datatype.number(20),
            }
          }
          return prev
        }, {}),
      },
      dpVersions: {
        kumaDp: {
          ...fake.helpers.uniqueArray(fake.system.semver, dataPlanes.totalVersions.length).reduce((prev: Record<string, { total: number, online: number }>, item, i) => {
            prev[item] = {
              total: dataPlanes.totalVersions[i],
              online: fake.datatype.number(dataPlanes.totalVersions[i]),
            }
            return prev
          }, {}),
        },
        envoy: {
          ...fake.helpers.uniqueArray(fake.system.semver, dataPlanes.totalVersions.length).reduce((prev: Record<string, { total: number, online: number }>, item, i) => {
            prev[item] = {
              total: dataPlanes.totalVersions[i],
              online: fake.datatype.number(dataPlanes.totalVersions[i]),
            }
            return prev
          }, {}),
        },
      },
      mTLS: {
        issuedBackends: {
          ...['ca-2', 'ca-1'].reduce((prev: Record<string, { total: number, online?: number }>, item) => {
            prev[item] = {
              total: fake.datatype.number(10),
            }
            prev[item].online = fake.datatype.number(prev[item].total)
            return prev
          }, {}),
        },
        supportedBackends: {
          ...['ca-2', 'ca-1'].reduce((prev: Record<string, { total: number, online?: number }>, item) => {
            prev[item] = {
              total: fake.datatype.number(10),
            }
            prev[item].online = fake.datatype.number(prev[item].total)
            return prev
          }, {}),
        },
      },
      services: {
        total: services,
        ...fake.kuma.partitionInto(['internal', 'external'], services),
      },
    },
  }
}
