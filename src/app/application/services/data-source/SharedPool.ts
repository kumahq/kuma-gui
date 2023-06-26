type Init<K, T> = (key: K) => T | undefined
type Del<K, T> = (key: K, item: T) => void
export default class SharedPool<K, T> {
  pool: Map<K, T> = new Map()
  usage: Map<T, symbol[]> = new Map()
  init: Init<K, T>
  del: (key: K, item: T) => void
  constructor(init: Init<K, T>, del: Del<K, T>) {
    this.init = init
    this.del = del
  }

  // getter, not init
  acquire(key: K, ref: symbol) {
    if (!this.pool.has(key)) {
      this.pool.set(key, this.init(key) as T)
    }
    const item = this.pool.get(key) as T
    if (typeof this.usage.get(item) === 'undefined') {
      this.usage.set(item, [])
    }
    const refs = this.usage.get(item) as symbol[]
    refs.push(ref)
    return item
  }

  // deleter
  release(key: K, ref: symbol) {
    if (this.pool.has(key)) {
      const item = this.pool.get(key) as T
      if (this.usage.has(item)) {
        const refs = this.usage.get(item) as symbol[]
        const pos = refs.findIndex((item) => item === ref)
        if (pos !== -1) {
          refs.splice(pos, 1)
        }
        if (refs.length === 0) {
          this.pool.delete(key)
          this.usage.delete(item)
          this.del(key, item)
        }
      }
    }
  }
}
