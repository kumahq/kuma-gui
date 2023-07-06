type Creator<K, T> = (key: K) => T
type Destroyer<K, T> = (key: K, item: T) => void

type Entry<T> = {
  value: T,
  usage: Set<symbol>
}
export default class SharedPool<K, T> {
  pool: Map<K, Entry<T>> = new Map()
  constructor(
    protected create: Creator<K, T>,
    protected destroy: Destroyer<K, T>,
  ) {}

  // getter, not init
  acquire(key: K, ref: symbol): T {
    // there is no way pool/usage.get(item) can be undefined due to using has hence
    // we use ! to avoid typescript
    if (!this.pool.has(key)) {
      const usage = {
        value: this.create(key),
        usage: new Set<symbol>(),
      }
      this.pool.set(key, usage)
    }
    const item = this.pool.get(key)!
    item.usage.add(ref)
    return item.value
  }

  // deleter
  release(key: K, ref: symbol) {
    // there is no way pool/usage.get(item) can be undefined due to using has hence
    // we use ! to avoid typescript
    if (this.pool.has(key)) {
      const item = this.pool.get(key)!
      item.usage.delete(ref)
      if (item.usage.size === 0) {
        this.pool.delete(key)
        this.destroy(key, item.value)
      }
    }
  }
}
