type Init<K, T> = (key: K) => T | undefined
type Del<K, T> = (key: K, item: T) => void
export default class SharedPool<K, T> {
  pool: Map<K, T> = new Map()
  usage: Map<T, Set<symbol>> = new Map()
  init: Init<K, T>
  del: (key: K, item: T) => void
  constructor(init: Init<K, T>, del: Del<K, T>) {
    this.init = init
    this.del = del
  }

  // getter, not init
  acquire(key: K, ref: symbol): T {
    // there is no way pool/usage.get(item) can be undefined due to using has hence
    // we use ! to avoid typescript
    if (!this.pool.has(key)) {
      this.pool.set(key, this.init(key) as T)
    }
    const item = this.pool.get(key)!
    if (!this.usage.has(item)) {
      this.usage.set(item, new Set<symbol>())
    }
    const refs = this.usage.get(item)!
    refs.add(ref)
    return item
  }

  // deleter
  release(key: K, ref: symbol) {
    // there is no way pool/usage.get(item) can be undefined due to using has hence
    // we use ! to avoid typescript
    if (this.pool.has(key)) {
      const item = this.pool.get(key)!
      if (this.usage.has(item)) {
        const refs = this.usage.get(item)!
        refs.delete(ref)
        if (refs.size === 0) {
          this.pool.delete(key)
          this.usage.delete(item)
          this.del(key, item)
        }
      }
    }
  }
}
