import { Module } from 'vuex'
import { RootInterface } from '../..'

export interface SidebarInterface {
  insights: {
    global: {
      meshes: number
      zoneCps: number
      zoneIngresses: number
    }
    mesh: {
      services: {
        internal: number
        external: number
      }
      dataplanes: {
        total: number
        standard: number
        gateway: number
      }
      policies: {
        CircuitBreaker: number
        FaultInjection: number
        HealthCheck: number
        ProxyTemplate: number
        TrafficLog: number
        TrafficPermission: number
        TrafficRoute: number
        TrafficTrace: number
        RateLimit: number
        Retry: number
        Timeout: number
      }
    }
  }
}

export type SidebarType = Module<SidebarInterface, RootInterface>
