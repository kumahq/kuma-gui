import { rest, RestHandler } from 'msw'

import { Info } from '@/types'

async function loadMockFile(importFn: () => Promise<any>): Promise<any> {
  const fileModule = await importFn()

  return fileModule.default
}

const BASE_INFO: Info = {
  hostname: 'Tomaszs-MacBook-Pro-16-inch-2019',
  tagline: 'Kuma',
  version: '1.7.1',
  basedOnKuma: '1.7.1',
  instanceId: 'Tomaszs-MacBook-Pro-16-inch-2019-c2a8',
  clusterId: 'ea1c9d9d-9722-4fda-8051-67e6fe0ad1b4',
}

const mockFileImports: Array<[string, () => Promise<any>]> = [
  ['config', () => import('./mock/responses/config.json')],
  ['versions', () => import('./mock/responses/versions.json')],
  ['policies', () => import('./mock/responses/policies.json')],
  ['status/zones', () => import('./mock/responses/status/zones.json')],
  ['global-insights', () => import('./mock/responses/global-insights.json')],
  ['external-services', () => import('./mock/responses/external-services.json')],
  // comment to have onboarding without data planes active
  ['dataplanes', () => import('./mock/responses/dataplanes.json')],
  ['service-insights', () => import('./mock/responses/service-insights.json')],

  ['zones', () => import('./mock/responses/zones.json')],
  ['zones+insights', () => import('./mock/responses/zones+insights.json')],
  ['zones+insights/zone-1', () => import('./mock/responses/zones+insights/zone-1.json')],
  ['zones+insights/zone-2', () => import('./mock/responses/zones+insights/zone-2.json')],
  ['zones+insights/zone-3', () => import('./mock/responses/zones+insights/zone-3.json')],
  ['zones+insights/cluster-1', () => import('./mock/responses/zones+insights/cluster-1.json')],
  ['zoneingresses/:zoneIngressName/xds', () => import('./mock/responses/dataplane-xds.json')],
  ['zoneingresses+insights', () => import('./mock/responses/zoneingresses+insights.json')],
  ['zoneegresses/:zoneEgressName/xds', () => import('./mock/responses/dataplane-xds.json')],
  ['zoneegressoverviews', () => import('./mock/responses/zoneegressoverviews.json')],

  ['mesh-insights', () => import('./mock/responses/mesh-insights.json')],
  ['mesh-insights/default', () => import('./mock/responses/mesh-insights/default.json')],
  ['mesh-insights/hello-world', () => import('./mock/responses/mesh-insights/hello-world.json')],
  ['mesh-insights/kong-mania-12', () => import('./mock/responses/mesh-insights/kong-mania-12.json')],

  ['meshes', () => import('./mock/responses/meshes.json')],
  ['meshes/default', () => import('./mock/responses/meshes/default.json')],
  ['meshes/default/circuit-breakers', () => import('./mock/responses/meshes/default/circuit-breakers.json')],
  ['meshes/default/circuit-breakers/cb1', () => import('./mock/responses/meshes/default/circuit-breakers/cb1.json')],
  ['meshes/default/circuit-breakers/cb2', () => import('./mock/responses/meshes/default/circuit-breakers/cb2.json')],
  ['meshes/default/dataplanes', () => import('./mock/responses/meshes/default/dataplanes.json')],
  ['meshes/default/dataplanes/backend', () => import('./mock/responses/meshes/default/dataplanes/backend.json')],
  ['meshes/default/dataplanes/cluster-1.backend-02', () => import('./mock/responses/meshes/default/dataplanes/cluster-1.backend-02.json')],
  ['meshes/default/dataplanes/cluster-1.backend-03', () => import('./mock/responses/meshes/default/dataplanes/cluster-1.backend-03.json')],
  ['meshes/default/dataplanes/cluster-1.gateway-01', () => import('./mock/responses/meshes/default/dataplanes/cluster-1.gateway-01.json')],
  ['meshes/default/dataplanes/cluster-1.gateway-01/policies', () => import('./mock/responses/meshes/default/dataplanes/cluster-1.gateway-01/policies.json')],
  ['meshes/default/dataplanes/cluster-1.ingress-02', () => import('./mock/responses/meshes/default/dataplanes/cluster-1.ingress-02.json')],
  ['meshes/default/dataplanes/dataplane-test-456', () => import('./mock/responses/meshes/default/dataplanes/dataplane-test-456.json')],
  ['meshes/default/dataplanes/db', () => import('./mock/responses/meshes/default/dataplanes/db.json')],
  ['meshes/default/dataplanes/frontend', () => import('./mock/responses/meshes/default/dataplanes/frontend.json')],
  ['meshes/default/dataplanes/ingress-dp-test-123', () => import('./mock/responses/meshes/default/dataplanes/ingress-dp-test-123.json')],
  ['meshes/default/dataplanes/no-subscriptions', () => import('./mock/responses/meshes/default/dataplanes/no-subscriptions.json')],
  ['meshes/default/dataplanes+insights', () => import('./mock/responses/meshes/default/dataplanes+insights.json')],
  ['meshes/default/dataplanes+insights/backend', () => import('./mock/responses/meshes/default/dataplanes+insights/backend.json')],
  ['meshes/default/dataplanes+insights/cluster-1.backend-02', () => import('./mock/responses/meshes/default/dataplanes+insights/cluster-1.backend-02.json')],
  ['meshes/default/dataplanes+insights/cluster-1.backend-03', () => import('./mock/responses/meshes/default/dataplanes+insights/cluster-1.backend-03.json')],
  ['meshes/default/dataplanes+insights/cluster-1.gateway-01', () => import('./mock/responses/meshes/default/dataplanes+insights/cluster-1.gateway-01.json')],
  ['meshes/default/dataplanes+insights/cluster-1.ingress-02', () => import('./mock/responses/meshes/default/dataplanes+insights/cluster-1.ingress-02.json')],
  ['meshes/default/dataplanes+insights/dataplane-test-456', () => import('./mock/responses/meshes/default/dataplanes+insights/dataplane-test-456.json')],
  ['meshes/default/dataplanes+insights/db', () => import('./mock/responses/meshes/default/dataplanes+insights/db.json')],
  ['meshes/default/dataplanes+insights/frontend', () => import('./mock/responses/meshes/default/dataplanes+insights/frontend.json')],
  ['meshes/default/dataplanes+insights/ingress-dp-test-123', () => import('./mock/responses/meshes/default/dataplanes+insights/ingress-dp-test-123.json')],
  ['meshes/default/dataplanes+insights/no-subscriptions', () => import('./mock/responses/meshes/default/dataplanes+insights/no-subscriptions.json')],
  ['meshes/default/service-insights/backend', () => import('./mock/responses/meshes/default/service-insights/backend.json')],
  ['meshes/default/service-insights/ingress', () => import('./mock/responses/meshes/default/service-insights/ingress.json')],
  ['meshes/default/service-insights/redis', () => import('./mock/responses/meshes/default/service-insights/redis.json')],
  ['meshes/default/external-services', () => import('./mock/responses/meshes/default/external-services.json')],
  ['meshes/default/external-services/httpbin', () => import('./mock/responses/meshes/default/external-services/httpbin.json')],
  ['meshes/default/external-services/httpbin2', () => import('./mock/responses/meshes/default/external-services/httpbin2.json')],
  ['meshes/default/fault-injections', () => import('./mock/responses/meshes/default/fault-injections.json')],
  ['meshes/default/fault-injections/fi1.kuma-system', () => import('./mock/responses/meshes/default/fault-injections/fi1.kuma-system.json')],
  ['meshes/default/fault-injections/web-to-backend.kuma-system', () => import('./mock/responses/meshes/default/fault-injections/web-to-backend.kuma-system.json')],
  ['meshes/default/health-checks', () => import('./mock/responses/meshes/default/health-checks.json')],
  ['meshes/default/health-checks/foo-bar-baz-123', () => import('./mock/responses/meshes/default/health-checks/foo-bar-baz-123.json')],
  ['meshes/default/health-checks/health-check-0023', () => import('./mock/responses/meshes/default/health-checks/health-check-0023.json')],
  ['meshes/default/health-checks/health-check-12345', () => import('./mock/responses/meshes/default/health-checks/health-check-12345.json')],
  ['meshes/default/health-checks/hello-health-check', () => import('./mock/responses/meshes/default/health-checks/hello-health-check.json')],
  ['meshes/default/health-checks/testing-health-checks', () => import('./mock/responses/meshes/default/health-checks/testing-health-checks.json')],
  ['meshes/default/health-checks/web-to-backend', () => import('./mock/responses/meshes/default/health-checks/web-to-backend.json')],
  ['meshes/default/health-checks/web-to-banana', () => import('./mock/responses/meshes/default/health-checks/web-to-banana.json')],
  ['meshes/default/meshgatewayroutes', () => import('./mock/responses/meshes/default/meshgatewayroutes.json')],
  ['meshes/default/meshgatewayroutes/edge-gateway', () => import('./mock/responses/meshes/default/meshgatewayroutes/edge-gateway.json')],
  ['meshes/default/meshgateways', () => import('./mock/responses/meshes/default/meshgateways.json')],
  ['meshes/default/meshgateways/edge-gateway', () => import('./mock/responses/meshes/default/meshgateways/edge-gateway.json')],
  ['meshes/default/proxytemplates', () => import('./mock/responses/meshes/default/proxytemplates.json')],
  ['meshes/default/proxytemplates/pt-1', () => import('./mock/responses/meshes/default/proxytemplates/pt-1.json')],
  ['meshes/default/retries', () => import('./mock/responses/meshes/default/retries.json')],
  ['meshes/default/service-insights', () => import('./mock/responses/meshes/default/service-insights.json')],
  ['meshes/default/timeouts', () => import('./mock/responses/meshes/default/timeouts.json')],
  ['meshes/default/traffic-logs', () => import('./mock/responses/meshes/default/traffic-logs.json')],
  ['meshes/default/traffic-logs/tl-1', () => import('./mock/responses/meshes/default/traffic-logs/tl-1.json')],
  ['meshes/default/traffic-logs/tl-123', () => import('./mock/responses/meshes/default/traffic-logs/tl-123.json')],
  ['meshes/default/traffic-permissions', () => import('./mock/responses/meshes/default/traffic-permissions.json')],
  ['meshes/default/traffic-permissions/tp-1', () => import('./mock/responses/meshes/default/traffic-permissions/tp-1.json')],
  ['meshes/default/traffic-permissions/tp-1234', () => import('./mock/responses/meshes/default/traffic-permissions/tp-1234.json')],
  ['meshes/default/traffic-permissions/tp-alpha-tango-donut', () => import('./mock/responses/meshes/default/traffic-permissions/tp-alpha-tango-donut.json')],
  ['meshes/default/traffic-routes', () => import('./mock/responses/meshes/default/traffic-routes.json')],
  ['meshes/default/traffic-traces', () => import('./mock/responses/meshes/default/traffic-traces.json')],
  ['meshes/default/traffic-traces/traffic-trace-02', () => import('./mock/responses/meshes/default/traffic-traces/traffic-trace-02.json')],
  ['meshes/default/traffic-traces/tt-1', () => import('./mock/responses/meshes/default/traffic-traces/tt-1.json')],
  ['meshes/default/traffic-traces/tt-3', () => import('./mock/responses/meshes/default/traffic-traces/tt-3.json')],

  ['meshes/hello-world', () => import('./mock/responses/meshes/hello-world.json')],
  ['meshes/hello-world/dataplanes', () => import('./mock/responses/meshes/hello-world/dataplanes.json')],
  ['meshes/hello-world/dataplanes+insights', () => import('./mock/responses/meshes/hello-world/dataplanes+insights.json')],
  ['meshes/hello-world/health-checks/hello-health-check', () => import('./mock/responses/meshes/hello-world/health-checks/hello-health-check.json')],
  ['meshes/hello-world/proxytemplates', () => import('./mock/responses/meshes/hello-world/proxytemplates.json')],
  ['meshes/hello-world/proxytemplates/pt-123', () => import('./mock/responses/meshes/hello-world/proxytemplates/pt-123.json')],
  ['meshes/hello-world/external-services', () => import('./mock/responses/meshes/hello-world/external-services.json')],
  ['meshes/hello-world/service-insights', () => import('./mock/responses/meshes/hello-world/service-insights.json')],
  ['meshes/hello-world/service-insights/frontend', () => import('./mock/responses/meshes/hello-world/service-insights/frontend.json')],
  ['meshes/hello-world/traffic-traces/tt-123', () => import('./mock/responses/meshes/hello-world/traffic-traces/tt-123.json')],

  ['meshes/kong-mania-12', () => import('./mock/responses/meshes/kong-mania-12.json')],
  ['meshes/kong-mania-12/dataplanes', () => import('./mock/responses/meshes/kong-mania-12/dataplanes.json')],
  ['meshes/kong-mania-12/dataplanes+insights', () => import('./mock/responses/meshes/kong-mania-12/dataplanes+insights.json')],
  ['meshes/kong-mania-12/external-services', () => import('./mock/responses/meshes/kong-mania-12/external-services.json')],
  ['meshes/kong-mania-12/health-checks/testing-health-checks', () => import('./mock/responses/meshes/kong-mania-12/health-checks/testing-health-checks.json')],
  ['meshes/kong-mania-12/health-checks/web-to-banana', () => import('./mock/responses/meshes/kong-mania-12/health-checks/web-to-banana.json')],
  ['meshes/kong-mania-12/service-insights', () => import('./mock/responses/meshes/kong-mania-12/service-insights.json')],
  ['meshes/kong-mania-12/traffic-traces/my-silly-mesh-name', () => import('./mock/responses/meshes/kong-mania-12/traffic-traces/my-silly-mesh-name.json')],

  // Policies
  ['circuit-breakers', () => import('./mock/responses/circuit-breakers.json')],
  ['fault-injections', () => import('./mock/responses/fault-injections.json')],
  ['health-checks', () => import('./mock/responses/health-checks.json')],
  ['meshgatewayroutes', () => import('./mock/responses/meshgatewayroutes.json')],
  ['meshgateways', () => import('./mock/responses/meshgateways.json')],
  ['proxytemplates', () => import('./mock/responses/proxytemplates.json')],
  ['rate-limits', () => import('./mock/responses/rate-limits.json')],
  ['retries', () => import('./mock/responses/retries.json')],
  ['timeouts', () => import('./mock/responses/timeouts.json')],
  ['traffic-logs', () => import('./mock/responses/traffic-logs.json')],
  ['traffic-permissions', () => import('./mock/responses/traffic-permissions.json')],
  ['traffic-routes', () => import('./mock/responses/traffic-routes.json')],
  ['traffic-traces', () => import('./mock/responses/traffic-traces.json')],
  ['virtual-outbounds', () => import('./mock/responses/virtual-outbounds.json')],

  // Define routes with dynamic segments last so they don’t match before more specific routes.
  ['meshes/:mesh/:policyType/:policyName/dataplanes', () => import('./mock/responses/policy-connections.json')],
  ['meshes/:mesh/dataplanes/:dataplaneName/policies', () => import('./mock/responses/dataplane-policies.json')],
  ['meshes/:mesh/dataplanes/:dataplaneName/xds', () => import('./mock/responses/dataplane-xds.json')],
]

export function setupHandlers(url: string): RestHandler[] {
  const origin = url.replace(/\/+$/, '')

  function getApiPath(path: string = '') {
    const escapedPath = path.replace(/\+/g, '\\+').replace(/\?/g, '\\?').replace(/^\/+/, '')

    return [origin, escapedPath].filter((segment) => segment !== '').join('/')
  }

  const handlers = mockFileImports.map(([path, importFn]) => {
    return rest.get(getApiPath(path), async (_req, res, ctx) => res(ctx.json(await loadMockFile(importFn))))
  })

  handlers.push(rest.get(getApiPath(), (_req, res, ctx) => res(ctx.json(BASE_INFO))))

  handlers.push(
    rest.get(getApiPath('dataplanes+insights'), async (req, res, ctx) => {
      const gateway = req.url.searchParams.get('gateway')

      let data
      if (gateway === 'false') {
        data = await loadMockFile(() => import('./mock/responses/dataplanes+insights__only-standard.json'))
      } else if (gateway === 'true') {
        data = await loadMockFile(() => import('./mock/responses/dataplanes+insights__only-gateways.json'))
      } else {
        const offset = req.url.searchParams.get('offset')
        const hasPositiveOffset = offset !== null && parseInt(offset) > 0

        if (hasPositiveOffset) {
          data = await loadMockFile(() => import('./mock/responses/dataplanes+insights-page-2.json'))
        } else {
          data = await loadMockFile(() => import('./mock/responses/dataplanes+insights.json'))
        }
      }

      return res(ctx.json(data))
    }),
  )

  // Basic test for API errors to easily test how errors with title, details, and causes are used in the UI.
  handlers.push(
    rest.get(getApiPath('meshes/:mesh/dataplanes/:dataplaneName/stats'), async (_req, res, ctx) =>
      res(
        ctx.status(403),
        ctx.json(await loadMockFile(() => import('./mock/responses/permission-error.json'))),
      ),
    ),
  )

  return handlers
}

export const additionalTestHandlers: RestHandler[] = [
  rest.get('https://kuma.io/latest_version/', (_req, res, ctx) => res(ctx.status(200), ctx.text('1.2.2'))),
]
