type Creator<K, T> = (key: K) => T
type Destroyer<K, T> = (key: K, item: T) => void

type Entry<T> = {
  value: T,
  references: Set<symbol>
}
export default class SharedPool<K, T> {
  pool: Map<K, Entry<T>> = new Map()
  constructor(
    protected create: Creator<K, T>,
    protected destroy: Destroyer<K, T>,
  ) {}

  // getter, not init
  acquire(key: K, ref: symbol): T {
    if (!this.pool.has(key)) {
      const references = {
        value: this.create(key),
        references: new Set<symbol>(),
      }
      this.pool.set(key, references)
    }
    // there is no way pool/usage.get(item) can be undefined due to using has
    // above hence we use ! to avoid typescript
    const item = this.pool.get(key)!
    item.references.add(ref)
    return item.value
  }

  // deleter
  release(key: K, ref: symbol) {
    if (this.pool.has(key)) {
    // there is no way pool/usage.get(item) can be undefined due to using has
    // above hence we use ! to avoid typescript
      const item = this.pool.get(key)!
      item.references.delete(ref)
      if (item.references.size === 0) {
        this.pool.delete(key)
        this.destroy(key, item.value)
      }
    }
  }
}
