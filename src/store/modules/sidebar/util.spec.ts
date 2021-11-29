import { calculateMeshInsights } from './utils'

describe('sidebar utils', () => {
  describe('calculateMeshInsights', () => {
    it('when no item', async () => {
      const meshInsight = calculateMeshInsights({ items: [] })

      expect(meshInsight).toMatchInlineSnapshot(`
        Object {
          "dataplanes": Object {
            "gateway": 0,
            "standard": 0,
            "total": 0,
          },
          "policies": Object {
            "CircuitBreaker": 0,
            "FaultInjection": 0,
            "HealthCheck": 0,
            "ProxyTemplate": 0,
            "RateLimit": 0,
            "Retry": 0,
            "Timeout": 0,
            "TrafficLog": 0,
            "TrafficPermission": 0,
            "TrafficRoute": 0,
            "TrafficTrace": 0,
          },
          "services": Object {
            "external": 0,
            "internal": 0,
          },
        }
      `)
    })
    it('when several items', async () => {
      const meshInsight = calculateMeshInsights({
        items: [
          {
            type: 'MeshInsight',
            name: 'default',
            creationTime: '2021-01-29T07:10:02.339031+01:00',
            modificationTime: '2021-01-29T07:29:02.314448+01:00',
            lastSync: '2021-01-29T06:29:02.314447Z',
            dataplanes: {
              total: 13,
              online: 3,
              partiallyDegraded: 5,
            },
            dataplanesByType: {
              gateway: {
                total: 5,
                online: 1,
                partiallyDegraded: 1,
              },
            },
            policies: {
              Secret: {
                total: 6,
              },
              TrafficPermission: {
                total: 3,
              },
              TrafficRoute: {
                total: 5,
              },
            },
            dpVersions: {
              kumaDp: {},
              envoy: {},
            },
            mTLS: {
              issuedBackends: {},
            },
            services: {
              total: 5,
              internal: 3,
              external: 2,
            },
          },
          {
            type: 'MeshInsight',
            name: 'hello-world',
            creationTime: '0001-01-01T00:00:00Z',
            modificationTime: '0001-01-01T00:00:00Z',
            lastSync: '2020-11-17T12:24:11.941534Z',
            dataplanes: {
              total: 1,
              partiallyDegraded: 1,
            },
            dataplanesByType: {
              standard: {
                total: 1,
                online: 0,
                partiallyDegraded: 1,
              },
              gateway: {},
            },
            policies: {
              Secret: {
                total: 1,
              },
              TrafficPermission: {
                total: 1,
              },
              TrafficRoute: {
                total: 1,
              },
            },
            dpVersions: {
              kumaDp: {},
              envoy: {},
            },
            mTLS: {},
            services: {
              total: 2,
              internal: 0,
              external: 2,
            },
          },
          {
            type: 'MeshInsight',
            name: 'kong-mania-12',
            creationTime: '0001-01-01T00:00:00Z',
            modificationTime: '0001-01-01T00:00:00Z',
            lastSync: '2020-11-17T12:24:11.941534Z',
            dataplanes: {
              total: 4,
              partiallyDegraded: 1,
            },
            dataplanesByType: {
              standard: {
                total: 4,
                online: 0,
                partiallyDegraded: 1,
              },
              gateway: {
                total: 0,
                online: 0,
                partiallyDegraded: 0,
              },
            },
            policies: {
              Secret: {
                total: 1,
              },
              TrafficPermission: {
                total: 1,
              },
              TrafficRoute: {
                total: 1,
              },
            },
            dpVersions: {},
            mTLS: {},
            services: {
              total: 2,
              internal: 0,
              external: 2,
            },
          },
        ],
      })

      expect(meshInsight).toMatchInlineSnapshot(`
        Object {
          "dataplanes": Object {
            "gateway": 5,
            "standard": 5,
            "total": 18,
          },
          "policies": Object {
            "CircuitBreaker": 0,
            "FaultInjection": 0,
            "HealthCheck": 0,
            "ProxyTemplate": 0,
            "RateLimit": 0,
            "Retry": 0,
            "Secret": NaN,
            "Timeout": 0,
            "TrafficLog": 0,
            "TrafficPermission": 5,
            "TrafficRoute": 7,
            "TrafficTrace": 0,
          },
          "services": Object {
            "external": 6,
            "internal": 3,
          },
        }
      `)
    })
  })
})
