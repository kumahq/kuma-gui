/**
 * Patches the query parameters when using vue router’s hash mode for navigation using the History API.
 *
 * This is a hack. It’s necessary because vue router’s hash mode doesn’t provide a mechanism for manipulating the URL’s query parameters without also triggering a navigation.
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
