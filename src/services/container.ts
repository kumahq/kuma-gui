import { env } from '@/services/env'
class Container {
  services: Map<string, any>
  constructor() {
    this.services = new Map()
  }

  get(key: string): any {
    return this.services.get(key)
  }

  set(key: string, obj: any) {
    this.services.set(key, obj)
  }
}

const container = new Container()
container.set('env', env)
export default container
