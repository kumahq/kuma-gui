/**
 * Patches the query parameters when using vue router’s history mode for navigation.
 *
 * For reference, here is how the implementation would look like in regular history mode:
 *
 * ```js
 * const url = new URL(window.location.href)
 *
 * if (value !== null && value !== undefined) {
 *   url.searchParams.set(name, String(value))
 * } else if (url.searchParams.has(name)) {
 *   url.searchParams.delete(name)
 * }
 *
 * window.history.replaceState({ path: url.href }, '', url.href)
 * ```
 *
 * @param value sets/updates `name` if value if is a string or number; otherwise, deletes `name`.
 */
export function patchQueryParam(name: string, value: string | number | null | undefined): void {
  const state = window.history.state

  if (state === null) {
    return
  }

  const queryStart = state.current.indexOf('?')
  const queryString = queryStart > -1 ? state.current.substring(queryStart) : ''
  const params = new URLSearchParams(queryString)

  if (value !== null && value !== undefined) {
    params.set(name, String(value))
  } else if (params.has(name)) {
    params.delete(name)
  }

  const newQueryString = params.toString()
  const completeQueryString = newQueryString === '' ? '' : '?' + newQueryString

  let newCurrent = ''
  if (queryStart > -1) {
    newCurrent = state.current.substring(0, queryStart) + completeQueryString
  } else {
    newCurrent = state.current + completeQueryString
  }

  if (state.current !== newCurrent) {
    const updatedState = Object.assign({}, state)
    updatedState.current = newCurrent
    window.history.replaceState(updatedState, '', '#' + newCurrent)
  }
}
