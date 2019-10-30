export function getItemFromStorage (item) {
  return JSON.parse(localStorage.getItem(item))
}

export function setItemToStorage (item, value) {
  return localStorage.setItem(item, value)
}

export default { getItemFromStorage, setItemToStorage }
