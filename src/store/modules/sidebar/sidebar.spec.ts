import setupStore from '@/testUtils/setupStore'
import sidebar from '.'

describe('sidebar module', () => {
  describe('actions', () => {
    it('tests getInsights action', async () => {
      const store = setupStore({ ...sidebar }, { selectedMesh: 'all' })

      await store.dispatch('getInsights')

      expect(store.state).toMatchInlineSnapshot(`
        Object {
          "insights": Object {
            "global": Object {
              "meshes": 4,
              "zoneIngresses": 1,
              "zones": 4,
            },
            "mesh": Object {
              "dataplanes": Object {
                "gateway": 5,
                "standard": 13,
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
            },
          },
          "selectedMesh": "all",
        }
      `)
    })
  })
})
