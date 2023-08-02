import type { EndpointDependencies, MockResponder } from '@/test-support'
export default (_deps: EndpointDependencies): MockResponder => (_req) => {
  return {
    headers: {},
    body: {
      policies: [
        {
          name: 'CircuitBreaker',
          path: 'circuit-breakers',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'FaultInjection',
          path: 'fault-injections',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'HealthCheck',
          path: 'health-checks',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'MeshAccessLog',
          path: 'meshaccesslogs',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'MeshCircuitBreaker',
          path: 'meshcircuitbreakers',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'MeshFaultInjection',
          path: 'meshfaultinjections',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'MeshGateway',
          path: 'meshgateways',
          readOnly: true,
          isExperimental: true,
        },
        {
          name: 'MeshGatewayRoute',
          path: 'meshgatewayroutes',
          readOnly: true,
          isExperimental: true,
        },
        {
          name: 'MeshHTTPRoute',
          path: 'meshhttproutes',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'MeshHealthCheck',
          path: 'meshhealthchecks',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'MeshLoadBalancingStrategy',
          path: 'meshloadbalancingstrategies',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'MeshProxyPatch',
          path: 'meshproxypatches',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'MeshRateLimit',
          path: 'meshratelimits',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'MeshRetry',
          path: 'meshretries',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'MeshTCPRoute',
          path: 'meshtcproutes',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'MeshTimeout',
          path: 'meshtimeouts',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'MeshTrace',
          path: 'meshtraces',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'MeshTrafficPermission',
          path: 'meshtrafficpermissions',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'ProxyTemplate',
          path: 'proxytemplates',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'RateLimit',
          path: 'rate-limits',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'Retry',
          path: 'retries',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'Timeout',
          path: 'timeouts',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'TrafficLog',
          path: 'traffic-logs',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'TrafficPermission',
          path: 'traffic-permissions',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'TrafficRoute',
          path: 'traffic-routes',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'TrafficTrace',
          path: 'traffic-traces',
          readOnly: true,
          isExperimental: false,
        },
        {
          name: 'VirtualOutbound',
          path: 'virtual-outbounds',
          readOnly: true,
          isExperimental: false,
        },
      ],
    },
  }
}
