export interface SidebarInterface {
  insights: {
    global: Record<string, number>
    mesh: {
      services: {
        total: number
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
