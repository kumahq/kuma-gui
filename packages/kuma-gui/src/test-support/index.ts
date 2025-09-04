import { base, en } from '@faker-js/faker'

import FakeKuma from './FakeKuma'
import type { RestRequest, MockResponder, FS as FakeFS } from '@kumahq/fake-api'

export type { MockResponder }
export type FS = FakeFS<EndpointDependencies>

type Pager = (total: string | number, req: RestRequest, self: string) => {
  next: string | null
  pageTotal: number
  total: number
  offset: number
  size: number
}
const pager: Pager = (_total: string | number, req: RestRequest, self) => {
  const baseUrl = 'http://localhost:5681'
  const total = parseInt(`${_total}`)
  const query = req.url.searchParams
  const size = parseInt(query.get('size') || '10')
  const offset = parseInt(query.get('offset') || '0')

  const remaining = total - offset
  const pageTotal = Math.min(size, remaining)
  const next = remaining <= size ? null : `${baseUrl}${self}?size=${size}offset=${offset + size}`
  return {
    next,
    pageTotal,
    total,
    offset,
    size,
  }
}
export type EndpointDependencies = {
  fake: FakeKuma
  pager: Pager
  env: (key: string, d: string) => string
}
export const dependencies = {
  fake: new FakeKuma({ locale: [base, en] }),
  pager,
  env: (_key: string, d = '') => d,
}
