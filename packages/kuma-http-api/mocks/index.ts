import { base, en } from '@faker-js/faker'

import type { Env as Keys } from './Env'
import FakeKuma from './FakeKuma'
export { default as FakeKuma } from './FakeKuma'
export { fs } from './fs'

export interface RestRequest {
  method: string
  params: Record<string, string | readonly string[]>
  body: Record<string, any>
  url: URL
}
export type Response = {
  headers?: Record<string, string>
  body: string | Record<string, unknown>
} | undefined

export type ResponseHandler = (req: RestRequest) => Response

export const pager = (total: string | number, req: RestRequest, self: string) => {
  const baseUrl = 'http://localhost:5681'
  const ttal = parseInt(`${total}`)
  const query = req.url.searchParams
  const size = parseInt(query.get('size') || '10')
  const offset = parseInt(query.get('offset') || '0')

  const remaining = ttal - offset
  const pageTotal = Math.min(size, remaining)
  const next = remaining <= size ? undefined : `${baseUrl}${self}?size=${size}offset=${offset + size}`
  return {
    next,
    pageTotal,
    total: ttal,
    offset,
    size,
  }
}
export type Pager = typeof pager

export interface Dependencies {
  fake: FakeKuma
  pager: Pager
  env: <T extends string = Keys>(keys: T, d?: string) => string
}

export const dependencies: Dependencies = {
  fake: new FakeKuma({ locale: [base, en] }),
  pager,
  env: (key, d = '') => d,
}

