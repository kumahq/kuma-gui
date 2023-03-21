import { faker } from '@faker-js/faker'
import { rest, RestRequest } from 'msw'

import _1 from '@/api/mocks/src/config'
import _0 from '@/api/mocks/src/index'
import FakeKuma from '@/services/kuma-api/FakeKuma'

export type EndpointDependencies = {
  fake: FakeKuma
}
type MockResponse = {
  headers: Record<string, unknown>
  body: Record<string, unknown>
}
type MockResponder = (req: RestRequest) => MockResponse
export type FakeEndpoint = (deps: EndpointDependencies) => MockResponder

function escapeRoute(route: string): string {
  return route.replaceAll('+', '\\+')
}

export const fakeApi = (url: string, fs: Record<string, FakeEndpoint>) => {
  return Object.entries(fs).map(([route, endpoint]) => {
    return rest.all(`${url}${escapeRoute(route)}`, async (req, res, ctx) => {
      const fetch = endpoint({
        fake: new FakeKuma(faker),
      })
      const response = fetch(req)
      return res(ctx.json(response.body))
    })
  })
}

export const fs: Record<string, FakeEndpoint> = {
  '/': _0,
  '/config': _1,
}
