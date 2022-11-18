import { LocationQueryValue } from 'vue-router'

export function getLastNumberParameter(param: LocationQueryValue | LocationQueryValue[], defaultValue: number = 0): number {
  const lastParam = getLastParameter(param)
  return lastParam !== undefined ? parseInt(lastParam) : defaultValue
}

export function getLastParameter(param: LocationQueryValue | LocationQueryValue[]): string | undefined {
  const paramList = Array.isArray(param) ? param : [param]
  return paramList[paramList.length - 1] ?? undefined
}
