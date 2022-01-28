import { Module } from 'vuex'
import { RootInterface } from '../..'

export interface SidebarInterface {
  insights: {
    global: Record<string, number>
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
      policies: Record<string, number>
    }
  }
}

export type SidebarType = Module<SidebarInterface, RootInterface>
