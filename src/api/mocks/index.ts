import { faker } from '@faker-js/faker'
import { rest, RestRequest } from 'msw'

import type Env from '@/services/env/Env'
import FakeKuma from '@/services/kuma-api/FakeKuma'
import type { Alias } from '@/services/utils'

export { fs } from './fs'

type Pager = (total: string | number, req: RestRequest, self: string) => {
  next: string | null,
  pageTotal: number,
  total: number,
  offset: number,
  size: number
}
const pager: Pager = (_total: string | number, req: RestRequest, self) => {
  const baseUrl = 'http://localhost:5681'
  const total = parseInt(`${_total}`)
  const query = req.url.searchParams
  const size = parseInt(query.get('size') || '10')
  const offset = parseInt(query.get('offset') || '1')
  const remaining = total - offset
  const pageTotal = Math.min(size, remaining)
  const next = remaining <= size ? null : `${baseUrl}${self}?offset=${offset + size}`
  return {
    next,
    pageTotal,
    total,
    offset,
    size,
  }
}

export type AEnv = Alias<Env['var']>
export type MockEnvKeys = keyof {
  FAKE_SEED: string
  KUMA_DATAPLANE_COUNT: string
}
export type AppEnvKeys = Parameters<AEnv>[0]
export type EndpointDependencies = {
  fake: FakeKuma
  pager: Pager,
  env: (key: AppEnvKeys | MockEnvKeys, d: string) => string
}
export type MockResponse = {
  headers: Record<string, string>
  body: string | Record<string, unknown>
}
export type MockResponder = (req: RestRequest) => MockResponse
export type FakeEndpoint = (deps: EndpointDependencies) => MockResponder

export function escapeRoute(route: string): string {
  return route.replaceAll('+', '\\+')
}
export const dependencies = {
  fake: new FakeKuma(faker),
  pager,
  env: (_key: AppEnvKeys | MockEnvKeys, d = '') => d,
}
export const fakeApi = (env: AEnv, fs: Record<string, FakeEndpoint>) => {
  const baseUrl = env('KUMA_API_URL')
  const mockEnv: EndpointDependencies['env'] = (key, d = '') => env(key as AppEnvKeys, d)

  return Object.entries(fs).map(([route, endpoint]) => {
    return rest.all(`${baseUrl}${escapeRoute(route)}`, async (req, res, ctx) => {
      const fetch = endpoint({
        ...dependencies,
        env: mockEnv,
      })
      const response = fetch(req)
      return res(
        ctx.status(parseInt(response.headers['Status-Code'] ?? '200')),
        ctx.json(response.body),
      )
    })
  })
}
export type FS = Record<string, FakeEndpoint>
