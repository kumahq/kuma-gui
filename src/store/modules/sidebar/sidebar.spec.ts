import { describe, expect, test } from '@jest/globals'

import sidebarModule from './sidebar'

describe('sidebar module', () => {
  describe('actions', () => {
    test('tests getInsights action', async () => {
      const rootState: any = {
        selectedMesh: 'default',
      }
      const state: any = sidebarModule.state()

      function commit(type: string, status: any): void {
        sidebarModule.mutations[type](state, status)
      }

      function dispatch(type: string): void {
        // @ts-ignore I can’t be bothered to battle Vuex’s loose types right now.
        return sidebarModule.actions[type]({ commit, state, rootState })
      }

      // @ts-ignore I can’t be bothered to battle Vuex’s loose types right now.
      await sidebarModule.actions.getInsights({ dispatch })

      expect(state).toMatchInlineSnapshot(`
{
  "insights": {
    "global": {
      "GlobalSecret": 0,
      "Mesh": 3,
      "Zone": 4,
      "ZoneEgress": 1,
      "ZoneIngress": 1,
    },
    "mesh": {
      "dataplanes": {
        "gateway": 1,
        "standard": 9,
        "total": 10,
      },
      "policies": {
        "CircuitBreaker": 2,
        "FaultInjection": 2,
        "HealthCheck": 4,
        "MeshGateway": 1,
        "MeshGatewayRoute": 1,
        "ProxyTemplate": 1,
        "RateLimit": 0,
        "Retry": 1,
        "Secret": 6,
        "Timeout": 1,
        "TrafficLog": 1,
        "TrafficPermission": 3,
        "TrafficRoute": 1,
        "TrafficTrace": 3,
        "VirtualOutbound": 0,
        "total": 27,
      },
      "services": {
        "external": 2,
        "internal": 3,
        "total": 5,
      },
    },
  },
}
`)
    })
  })
})
