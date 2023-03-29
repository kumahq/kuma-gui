import { rest, RestHandler } from 'msw'

import type Env from '@/services/env/Env'
async function loadMockFile(importFn: () => Promise<any>): Promise<any> {
  const fileModule = await importFn()

  return fileModule.default
}

export type Mocks = Array<[string, () => Promise<any>]>
export const mocks: Mocks = [
  ['versions', () => import('./mock-data/versions.json')],
  ['policies', () => import('./mock-data/policies.json')],
  ['status/zones', () => import('./mock-data/status/zones.json')],
  ['global-insights', () => import('./mock-data/global-insights.json')],
  ['external-services', () => import('./mock-data/external-services.json')],
  // comment to have onboarding without data planes active
  ['dataplanes', () => import('./mock-data/dataplanes.json')],
  ['service-insights', () => import('./mock-data/service-insights.json')],

  ['zones', () => import('./mock-data/zones.json')],
  ['zones\\+insights', () => import('./mock-data/zones+insights.json')],
  ['zones\\+insights/zone-1', () => import('./mock-data/zones+insights/zone-1.json')],
  ['zones\\+insights/zone-2', () => import('./mock-data/zones+insights/zone-2.json')],
  ['zones\\+insights/zone-3', () => import('./mock-data/zones+insights/zone-3.json')],
  ['zones\\+insights/cluster-1', () => import('./mock-data/zones+insights/cluster-1.json')],
  ['zoneingresses/:zoneIngressName/xds', () => import('./mock-data/dataplane-xds.json')],
  ['zoneingresses\\+insights', () => import('./mock-data/zoneingresses+insights.json')],
  ['zoneegresses/:zoneEgressName/xds', () => import('./mock-data/dataplane-xds.json')],
  ['zoneegressoverviews', () => import('./mock-data/zoneegressoverviews.json')],

  ['mesh-insights', () => import('./mock-data/mesh-insights.json')],
  ['mesh-insights/default', () => import('./mock-data/mesh-insights/default.json')],
  ['mesh-insights/hello-world', () => import('./mock-data/mesh-insights/hello-world.json')],
  ['mesh-insights/kong-mania-12', () => import('./mock-data/mesh-insights/kong-mania-12.json')],

  ['meshes', () => import('./mock-data/meshes.json')],
  ['meshes/default', () => import('./mock-data/meshes/default.json')],
  ['meshes/default/circuit-breakers', () => import('./mock-data/meshes/default/circuit-breakers.json')],
  ['meshes/default/circuit-breakers/cb1', () => import('./mock-data/meshes/default/circuit-breakers/cb1.json')],
  ['meshes/default/circuit-breakers/cb2', () => import('./mock-data/meshes/default/circuit-breakers/cb2.json')],
  ['meshes/default/dataplanes', () => import('./mock-data/meshes/default/dataplanes.json')],
  ['meshes/default/dataplanes/backend', () => import('./mock-data/meshes/default/dataplanes/backend.json')],
  ['meshes/default/dataplanes/cluster-1.backend-02', () => import('./mock-data/meshes/default/dataplanes/cluster-1.backend-02.json')],
  ['meshes/default/dataplanes/cluster-1.backend-03', () => import('./mock-data/meshes/default/dataplanes/cluster-1.backend-03.json')],
  ['meshes/default/dataplanes/cluster-1.gateway-01', () => import('./mock-data/meshes/default/dataplanes/cluster-1.gateway-01.json')],
  ['meshes/default/dataplanes/cluster-1.gateway-01/policies', () => import('./mock-data/meshes/default/dataplanes/cluster-1.gateway-01/policies.json')],
  ['meshes/default/dataplanes/cluster-1.ingress-02', () => import('./mock-data/meshes/default/dataplanes/cluster-1.ingress-02.json')],
  ['meshes/default/dataplanes/dataplane-test-456', () => import('./mock-data/meshes/default/dataplanes/dataplane-test-456.json')],
  ['meshes/default/dataplanes/db', () => import('./mock-data/meshes/default/dataplanes/db.json')],
  ['meshes/default/dataplanes/frontend', () => import('./mock-data/meshes/default/dataplanes/frontend.json')],
  ['meshes/default/dataplanes/ingress-dp-test-123', () => import('./mock-data/meshes/default/dataplanes/ingress-dp-test-123.json')],
  ['meshes/default/dataplanes/no-subscriptions', () => import('./mock-data/meshes/default/dataplanes/no-subscriptions.json')],
  ['meshes/default/dataplanes\\+insights/backend', () => import('./mock-data/meshes/default/dataplanes+insights/backend.json')],
  ['meshes/default/dataplanes\\+insights/cluster-1.backend-02', () => import('./mock-data/meshes/default/dataplanes+insights/cluster-1.backend-02.json')],
  ['meshes/default/dataplanes\\+insights/cluster-1.backend-03', () => import('./mock-data/meshes/default/dataplanes+insights/cluster-1.backend-03.json')],
  ['meshes/default/dataplanes\\+insights/cluster-1.gateway-01', () => import('./mock-data/meshes/default/dataplanes+insights/cluster-1.gateway-01.json')],
  ['meshes/default/dataplanes\\+insights/cluster-1.ingress-02', () => import('./mock-data/meshes/default/dataplanes+insights/cluster-1.ingress-02.json')],
  ['meshes/default/dataplanes\\+insights/dataplane-test-456', () => import('./mock-data/meshes/default/dataplanes+insights/dataplane-test-456.json')],
  ['meshes/default/dataplanes\\+insights/db', () => import('./mock-data/meshes/default/dataplanes+insights/db.json')],
  ['meshes/default/dataplanes\\+insights/frontend', () => import('./mock-data/meshes/default/dataplanes+insights/frontend.json')],
  ['meshes/default/dataplanes\\+insights/ingress-dp-test-123', () => import('./mock-data/meshes/default/dataplanes+insights/ingress-dp-test-123.json')],
  ['meshes/default/dataplanes\\+insights/no-subscriptions', () => import('./mock-data/meshes/default/dataplanes+insights/no-subscriptions.json')],
  ['meshes/default/service-insights/backend', () => import('./mock-data/meshes/default/service-insights/backend.json')],
  ['meshes/default/service-insights/httpbin', () => import('./mock-data/meshes/default/service-insights/httpbin.json')],
  ['meshes/default/service-insights/httpbin2', () => import('./mock-data/meshes/default/service-insights/httpbin2.json')],
  ['meshes/default/service-insights/ingress', () => import('./mock-data/meshes/default/service-insights/ingress.json')],
  ['meshes/default/service-insights/redis', () => import('./mock-data/meshes/default/service-insights/redis.json')],
  ['meshes/default/external-services', () => import('./mock-data/meshes/default/external-services.json')],
  ['meshes/default/external-services/httpbin-external-service', () => import('./mock-data/meshes/default/external-services/httpbin-external-service.json')],
  ['meshes/default/external-services/httpbin2-external-service', () => import('./mock-data/meshes/default/external-services/httpbin2-external-service.json')],
  ['meshes/default/fault-injections', () => import('./mock-data/meshes/default/fault-injections.json')],
  ['meshes/default/fault-injections/fi1.kuma-system', () => import('./mock-data/meshes/default/fault-injections/fi1.kuma-system.json')],
  ['meshes/default/fault-injections/web-to-backend.kuma-system', () => import('./mock-data/meshes/default/fault-injections/web-to-backend.kuma-system.json')],
  ['meshes/default/health-checks', () => import('./mock-data/meshes/default/health-checks.json')],
  ['meshes/default/health-checks/foo-bar-baz-123', () => import('./mock-data/meshes/default/health-checks/foo-bar-baz-123.json')],
  ['meshes/default/health-checks/health-check-0023', () => import('./mock-data/meshes/default/health-checks/health-check-0023.json')],
  ['meshes/default/health-checks/health-check-12345', () => import('./mock-data/meshes/default/health-checks/health-check-12345.json')],
  ['meshes/default/health-checks/hello-health-check', () => import('./mock-data/meshes/default/health-checks/hello-health-check.json')],
  ['meshes/default/health-checks/testing-health-checks', () => import('./mock-data/meshes/default/health-checks/testing-health-checks.json')],
  ['meshes/default/health-checks/web-to-backend', () => import('./mock-data/meshes/default/health-checks/web-to-backend.json')],
  ['meshes/default/health-checks/web-to-banana', () => import('./mock-data/meshes/default/health-checks/web-to-banana.json')],
  ['meshes/default/meshgatewayroutes', () => import('./mock-data/meshes/default/meshgatewayroutes.json')],
  ['meshes/default/meshgatewayroutes/edge-gateway', () => import('./mock-data/meshes/default/meshgatewayroutes/edge-gateway.json')],
  ['meshes/default/meshgateways', () => import('./mock-data/meshes/default/meshgateways.json')],
  ['meshes/default/meshgateways/edge-gateway', () => import('./mock-data/meshes/default/meshgateways/edge-gateway.json')],
  ['meshes/default/proxytemplates', () => import('./mock-data/meshes/default/proxytemplates.json')],
  ['meshes/default/proxytemplates/pt-1', () => import('./mock-data/meshes/default/proxytemplates/pt-1.json')],
  ['meshes/default/retries', () => import('./mock-data/meshes/default/retries.json')],
  ['meshes/default/service-insights', () => import('./mock-data/meshes/default/service-insights.json')],
  ['meshes/default/timeouts', () => import('./mock-data/meshes/default/timeouts.json')],
  ['meshes/default/traffic-logs', () => import('./mock-data/meshes/default/traffic-logs.json')],
  ['meshes/default/traffic-logs/tl-1', () => import('./mock-data/meshes/default/traffic-logs/tl-1.json')],
  ['meshes/default/traffic-logs/tl-123', () => import('./mock-data/meshes/default/traffic-logs/tl-123.json')],
  ['meshes/default/traffic-permissions/tp-1', () => import('./mock-data/meshes/default/traffic-permissions/tp-1.json')],
  ['meshes/default/traffic-permissions/tp-4', () => import('./mock-data/meshes/default/traffic-permissions/tp-4.json')],
  ['meshes/default/traffic-permissions/tp-5', () => import('./mock-data/meshes/default/traffic-permissions/tp-5.json')],
  ['meshes/default/traffic-permissions/tp-1234', () => import('./mock-data/meshes/default/traffic-permissions/tp-1234.json')],
  ['meshes/default/traffic-permissions/tp-alpha-tango-donut', () => import('./mock-data/meshes/default/traffic-permissions/tp-alpha-tango-donut.json')],
  ['meshes/default/traffic-routes', () => import('./mock-data/meshes/default/traffic-routes.json')],
  ['meshes/default/traffic-traces', () => import('./mock-data/meshes/default/traffic-traces.json')],
  ['meshes/default/traffic-traces/traffic-trace-02', () => import('./mock-data/meshes/default/traffic-traces/traffic-trace-02.json')],
  ['meshes/default/traffic-traces/tt-1', () => import('./mock-data/meshes/default/traffic-traces/tt-1.json')],
  ['meshes/default/traffic-traces/tt-3', () => import('./mock-data/meshes/default/traffic-traces/tt-3.json')],

  ['meshes/hello-world', () => import('./mock-data/meshes/hello-world.json')],
  ['meshes/hello-world/dataplanes', () => import('./mock-data/meshes/hello-world/dataplanes.json')],
  ['meshes/hello-world/dataplanes\\+insights', () => import('./mock-data/meshes/hello-world/dataplanes+insights.json')],
  ['meshes/hello-world/health-checks/hello-health-check', () => import('./mock-data/meshes/hello-world/health-checks/hello-health-check.json')],
  ['meshes/hello-world/proxytemplates', () => import('./mock-data/meshes/hello-world/proxytemplates.json')],
  ['meshes/hello-world/proxytemplates/pt-123', () => import('./mock-data/meshes/hello-world/proxytemplates/pt-123.json')],
  ['meshes/hello-world/external-services', () => import('./mock-data/meshes/hello-world/external-services.json')],
  ['meshes/hello-world/service-insights', () => import('./mock-data/meshes/hello-world/service-insights.json')],
  ['meshes/hello-world/service-insights/frontend', () => import('./mock-data/meshes/hello-world/service-insights/frontend.json')],
  ['meshes/hello-world/traffic-traces/tt-123', () => import('./mock-data/meshes/hello-world/traffic-traces/tt-123.json')],

  ['meshes/kong-mania-12', () => import('./mock-data/meshes/kong-mania-12.json')],
  ['meshes/kong-mania-12/dataplanes', () => import('./mock-data/meshes/kong-mania-12/dataplanes.json')],
  ['meshes/kong-mania-12/dataplanes\\+insights', () => import('./mock-data/meshes/kong-mania-12/dataplanes+insights.json')],
  ['meshes/kong-mania-12/external-services', () => import('./mock-data/meshes/kong-mania-12/external-services.json')],
  ['meshes/kong-mania-12/health-checks/testing-health-checks', () => import('./mock-data/meshes/kong-mania-12/health-checks/testing-health-checks.json')],
  ['meshes/kong-mania-12/health-checks/web-to-banana', () => import('./mock-data/meshes/kong-mania-12/health-checks/web-to-banana.json')],
  ['meshes/kong-mania-12/service-insights', () => import('./mock-data/meshes/kong-mania-12/service-insights.json')],
  ['meshes/kong-mania-12/traffic-traces/my-silly-mesh-name', () => import('./mock-data/meshes/kong-mania-12/traffic-traces/my-silly-mesh-name.json')],

  // Policies
  ['circuit-breakers', () => import('./mock-data/circuit-breakers.json')],
  ['fault-injections', () => import('./mock-data/fault-injections.json')],
  ['health-checks', () => import('./mock-data/health-checks.json')],
  ['meshgatewayroutes', () => import('./mock-data/meshgatewayroutes.json')],
  ['meshgateways', () => import('./mock-data/meshgateways.json')],
  ['proxytemplates', () => import('./mock-data/proxytemplates.json')],
  ['rate-limits', () => import('./mock-data/rate-limits.json')],
  ['retries', () => import('./mock-data/retries.json')],
  ['timeouts', () => import('./mock-data/timeouts.json')],
  ['traffic-logs', () => import('./mock-data/traffic-logs.json')],
  ['traffic-permissions', () => import('./mock-data/traffic-permissions.json')],
  ['traffic-routes', () => import('./mock-data/traffic-routes.json')],
  ['traffic-traces', () => import('./mock-data/traffic-traces.json')],
  ['virtual-outbounds', () => import('./mock-data/virtual-outbounds.json')],

  // Define routes with dynamic segments last so they don’t match before more specific routes.
  ['meshes/:mesh/:policyType/:policyName/dataplanes', () => import('./mock-data/policy-connections.json')],
  ['meshes/:mesh/dataplanes/:dataplaneName/policies', () => import('./mock-data/dataplane-policies.json')],
  ['meshes/:mesh/dataplanes/:dataplaneName/rules', () => import('./mock-data/dataplane-rules.json')],
]

export function setupHandlers(url: string = '', mocks: Mocks, env: Env): RestHandler[] {
  const origin = url.replace(/\/+$/, '')

  function getApiPath(path: string = '') {
    const escapedPath = path.replace(/^\/+/, '')

    return [origin, escapedPath].filter((segment) => segment !== '').join('/')
  }

  const handlers = mocks.map(([path, importFn]) => {
    return rest.get(getApiPath(path), async (_req, res, ctx) => res(ctx.json(await loadMockFile(importFn))))
  })

  handlers.push(rest.get(env.var('KUMA_VERSION_URL'), (_req, res, ctx) => res(ctx.text('5.0.2'))))

  return handlers
}
