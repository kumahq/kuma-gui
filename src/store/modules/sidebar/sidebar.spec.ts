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
              "GlobalSecret": 0,
              "Mesh": 4,
              "Zone": 4,
              "ZoneEgress": 1,
              "ZoneIngress": 1,
            },
            "mesh": Object {
              "dataplanes": Object {
                "gateway": 5,
                "standard": 13,
                "total": 18,
              },
              "policies": Object {
                "FaultInjection": 2,
                "Gateway": 1,
                "GatewayRoute": 1,
                "HealthCheck": 7,
                "Secret": 8,
                "Timeout": 1,
                "TrafficPermission": 5,
                "TrafficRoute": 7,
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
