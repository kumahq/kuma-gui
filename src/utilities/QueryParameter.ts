/**
 * Utility for getting and setting query parameters.
 *
 * Abstracts away the following responsibilities:
 *
 * * Encoding space characters as `+`.
 * * Patching query parameters without triggering a navigation when using vue router.
 */
export const QueryParameter = {
  /**
   * Gets a query parameter.
   */
  get(name: string): string | null {
    const url = new URL(window.location.href)
    const query = url.searchParams.get(name)

    if (query !== null) {
      return query.replaceAll('+', ' ')
    } else {
      return null
    }
  },

  /**
   * Sets a query parameter.
   *
   * @param value sets/updates `name` if value if is a string or number; otherwise, deletes `name`.
   */
  set(name: string, value: string | number | null | undefined): void {
    const url = new URL(window.location.href)

    if (value !== null && value !== undefined) {
      url.searchParams.set(name, String(value).replace(/\s/g, '+'))
    } else if (url.searchParams.has(name)) {
      url.searchParams.delete(name)
    }

    window.history.replaceState({ path: url.href }, '', url.href)
  },
}
