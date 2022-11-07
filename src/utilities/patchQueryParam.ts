/**
 * Patches the query parameters when using vue router’s history mode for navigation.
 *
 * @param value sets/updates `name` if value if is a string or number; otherwise, deletes `name`.
 */
export function patchQueryParam(name: string, value: string | number | null | undefined): void {
  const url = new URL(window.location.href)

  if (value !== null && value !== undefined) {
    url.searchParams.set(name, String(value))
  } else if (url.searchParams.has(name)) {
    url.searchParams.delete(name)
  }

  window.history.replaceState({ path: url.href }, '', url.href)
}
