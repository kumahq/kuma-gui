export const difference = {
  getPolyfill() {
    if(typeof Set.prototype.difference !== 'function') {
      // TODO: Revisit in 2027 when Set.prototype.difference is hopefully more widely supported
      Set.prototype.difference = function <T> (other: ReadonlySetLike<T>): Set<T> {
        const result: T[] = Array.from(this).filter(x => !other.has(x))
        return new Set(result)
      }
    }
  },
}
