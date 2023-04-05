import { describe, expect, test } from '@jest/globals'

import _sidebarModule from './sidebar'
import { useMock } from '@/../jest/jest-setup-after-env'
import { get, TOKENS } from '@/services'
const sidebarModule = _sidebarModule(get(TOKENS.api))
describe('sidebar module', () => {
  describe('actions', () => {
    const mock = useMock()
    test('tests getInsights action', async () => {
      mock('/global-insights', {
        KUMA_GLOBALSECRET_COUNT: '0',
        KUMA_MESH_COUNT: '3',
        KUMA_ZONE_COUNT: '4',
        KUMA_ZONEINGRESS_COUNT: '1',
        KUMA_ZONEEGRESS_COUNT: '1',
      })
      mock('/mesh-insights/:mesh', {
      }, (merge) => {
        return merge({
          body: {
            dataplanes: {
              total: 10,
            },
            dataplanesByType: {
              standard: {
                total: 9,
              },
              gateway: {
                total: 1,
              },
            },
            policies: {
              CircuitBreaker: {
                total: 2,
              },
              FaultInjection: {
                total: 2,
              },
              HealthCheck: {
                total: 4,
              },
              MeshGateway: {
                total: 1,
              },
              MeshGatewayRoute: {
                total: 1,
              },
              ProxyTemplate: {
                total: 1,
              },
              RateLimit: {
                total: 0,
              },
              Retry: {
                total: 1,
              },
              Timeout: {
                total: 1,
              },
              TrafficLog: {
                total: 1,
              },
              TrafficPermission: {
                total: 3,
              },
              TrafficRoute: {
                total: 1,
              },
              TrafficTrace: {
                total: 3,
              },
              VirtualOutbound: {
                total: 0,
              },

            },
            services: {
              external: 2,
              internal: 3,
              total: 5,
            },
          },
        })
      })
      const rootState: any = {
        selectedMesh: 'default',
      }
      const state: any = sidebarModule.state()

      function commit(type: string, status: any, options?: { root: boolean }): void {
        // only call local mutations
        if (!options?.root) {
          sidebarModule.mutations[type](state, status)
        }
      }

      function dispatch(type: string): void {
        const action = sidebarModule.actions[type] as Function
        return action({ commit, state, rootState })
      }

      const action = sidebarModule.actions.getInsights as Function
      await action({ dispatch })
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
        "Timeout": 1,
        "TrafficLog": 1,
        "TrafficPermission": 3,
        "TrafficRoute": 1,
        "TrafficTrace": 3,
        "VirtualOutbound": 0,
        "total": 21,
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
