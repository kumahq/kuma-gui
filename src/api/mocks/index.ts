import { faker } from '@faker-js/faker'
import { rest, RestRequest } from 'msw'

import _1 from '@/api/mocks/src/config'
import _0 from '@/api/mocks/src/index'
import _5 from '@/api/mocks/src/meshes/_/dataplanes/_'
import _7 from '@/api/mocks/src/meshes/_/dataplanes/_/clusters'
import _4 from '@/api/mocks/src/meshes/_/dataplanes/_/stats'
import _8 from '@/api/mocks/src/meshes/_/dataplanes/_/xds'
import _3 from '@/api/mocks/src/meshes/_/dataplanes+insights'
import _6 from '@/api/mocks/src/meshes/_/dataplanes+insights/_'
import _2 from '@/api/mocks/src/meshes/_/traffic-permissions'
import FakeKuma from '@/services/kuma-api/FakeKuma'

type Pager = (total: number, req: RestRequest, self: string) => {
  next: string | null,
  pageTotal: number,
  total: number,
  offset: number,
  size: number
}
const pager: Pager = (total, req: RestRequest, self) => {
  const query = req.url.searchParams
  const size = parseInt(query.get('size') || '10')
  const offset = parseInt(query.get('offset') || '1')
  const remaining = total - offset
  const pageTotal = Math.min(size, remaining)
  const next = remaining <= size ? null : `${self}?offset=${offset + size}`
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
}
type MockResponse = {
  headers: Record<string, string>
  body: string | Record<string, unknown>
}
export type MockResponder = (req: RestRequest) => MockResponse
export type FakeEndpoint = (deps: EndpointDependencies) => MockResponder

function escapeRoute(route: string): string {
  return route.replaceAll('+', '\\+')
}

export const fakeApi = (url: string, fs: Record<string, FakeEndpoint>) => {
  return Object.entries(fs).map(([route, endpoint]) => {
    return rest.all(`${url}${escapeRoute(route)}`, async (req, res, ctx) => {
      const fetch = endpoint({
        fake: new FakeKuma(faker),
        pager,
      })
      const response = fetch(req)
      return res(
        ctx.status(parseInt(response.headers['Status-Code'] ?? '200')),
        ctx.json(response.body),
      )
    })
  })
}

export const fs: Record<string, FakeEndpoint> = {
  '/': _0,
  '/config': _1,
  '/meshes/:mesh/traffic-permissions': _2,
  '/meshes/:mesh/dataplanes+insights': _3,
  '/meshes/:mesh/dataplanes+insights/:name': _6,
  '/meshes/:mesh/dataplanes/:name': _5,
  '/meshes/:mesh/dataplanes/:name/clusters': _7,
  '/meshes/:mesh/dataplanes/:name/stats': _4,
  '/meshes/:mesh/dataplanes/:name/xds': _8,
}
