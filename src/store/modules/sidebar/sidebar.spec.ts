import { createStore } from 'vuex'

import { storeConfig, State } from '../../index'

describe('sidebar module', () => {
  describe('actions', () => {
    it('tests getInsights action', async () => {
      const store = createStore<State>(storeConfig)

      await store.dispatch('sidebar/getInsights')

      expect(store.state.selectedMesh).toBe('all')
      expect(store.state.sidebar).toMatchInlineSnapshot(`
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
                "gateway": 1,
                "standard": 7,
                "total": 8,
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
        }
      `)
    })
  })
})
