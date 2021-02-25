export function getItemFromStorage (item: string) {
  const itemFromStorage = localStorage.getItem(item) || null

  if (itemFromStorage) {
    return JSON.parse(itemFromStorage)
  }
}

export function setItemToStorage (cacheKey: string, value: any) {
  return localStorage.setItem(cacheKey, value)
}

export default { getItemFromStorage, setItemToStorage }
