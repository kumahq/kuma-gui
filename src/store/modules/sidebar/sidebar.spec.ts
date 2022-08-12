import sidebar from '.'
import setupStore from '@/testUtils/setupStore'

describe('sidebar module', () => {
  describe('actions', () => {
    it('tests getInsights action', async () => {
      const store = setupStore({ ...sidebar }, { selectedMesh: 'all' })

      await store.dispatch('getInsights')

      expect(store.state).toMatchInlineSnapshot(`
        Object {
          "insights": Object {
            "global": Object {
              "GlobalSecret": 0,
              "Mesh": 3,
              "Zone": 4,
              "ZoneEgress": 1,
              "ZoneIngress": 1,
            },
            "mesh": Object {
              "dataplanes": Object {
                "gateway": 8,
                "standard": 8,
                "total": 16,
              },
              "policies": Object {
                "CircuitBreaker": 2,
                "FaultInjection": 2,
                "HealthCheck": 7,
                "MeshGateway": 1,
                "MeshGatewayRoute": 1,
                "ProxyTemplate": 2,
                "RateLimit": 0,
                "Retry": 1,
                "Secret": 8,
                "Timeout": 1,
                "TrafficLog": 1,
                "TrafficPermission": 3,
                "TrafficRoute": 1,
                "TrafficTrace": 5,
                "VirtualOutbound": 0,
              },
              "services": Object {
                "external": 2,
                "internal": 4,
              },
            },
          },
          "selectedMesh": "all",
        }
      `)
    })
  })
})
