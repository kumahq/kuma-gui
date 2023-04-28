import { faker } from '@faker-js/faker'
import { RestRequest } from 'msw'

import FakeKuma from './FakeKuma'
import type AppEnv from '@/services/env/Env'
import type { Alias } from '@/services/utils'
import type { rest } from 'msw'

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
  const offset = parseInt(query.get('offset') || '0')

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

export type AEnv = Alias<AppEnv['var']>
export type MockEnvKeys = keyof {
  FAKE_SEED: string
  KUMA_DATAPLANE_COUNT: string
  KUMA_CIRCUITBREAKER_COUNT: string
  KUMA_SERVICEINSIGHT_COUNT: string
  KUMA_ZONEEGRESS_COUNT: string
  KUMA_ZONEINGRESS_COUNT: string
  KUMA_ZONE_COUNT: string
  KUMA_MESH_COUNT: string
  KUMA_GLOBALSECRET_COUNT: string
  KUMA_MODE: string
  KUMA_LATENCY: string
}
export type AppEnvKeys = Parameters<AEnv>[0]
export type Env = (key: AppEnvKeys | MockEnvKeys, d: string) => string
export type EndpointDependencies = {
  fake: FakeKuma
  pager: Pager
  env: Env
}
export type MockResponse = {
  headers: Record<string, string>
  body: string | Record<string, unknown>
}
export type MockResponder = (req: RestRequest) => MockResponse
export type FakeEndpoint = (deps: EndpointDependencies) => MockResponder

export type FS = Record<string, FakeEndpoint>
type Server = typeof rest
export function escapeRoute(route: string): string {
  return route.replaceAll('+', '\\+')
}
export const dependencies: EndpointDependencies = {
  fake: new FakeKuma(faker),
  pager,
  env: (key, d = '') => d,
}
export const fakeApi = (env: AEnv, server: Server, fs: FS) => {
  const baseUrl = env('KUMA_API_URL')
  const mockEnv: Env = (key, d = '') => env(key as AppEnvKeys, d)

  return Object.entries(fs).map(([route, endpoint]) => {
    return server.all(`${route.startsWith('https://') ? '' : baseUrl}${escapeRoute(route)}`, async (req, res, ctx) => {
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
