import type { EndpointDependencies } from '@/test-support/fake'
export default <T extends EndpointDependencies>(_deps: T) => () => {
  return {
    headers: {},
    body: {
      policies: [
        {
          name: 'CircuitBreaker',
          path: 'circuit-breakers',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'FaultInjection',
          path: 'fault-injections',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'HealthCheck',
          path: 'health-checks',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'MeshAccessLog',
          path: 'meshaccesslogs',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'MeshCircuitBreaker',
          path: 'meshcircuitbreakers',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'MeshGateway',
          path: 'meshgateways',
          readOnly: false,
          isExperimental: true,
        },
        {
          name: 'MeshGatewayRoute',
          path: 'meshgatewayroutes',
          readOnly: false,
          isExperimental: true,
        },
        {
          name: 'MeshHealthCheck',
          path: 'meshhealthchecks',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'MeshProxyPatch',
          path: 'meshproxypatches',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'MeshRateLimit',
          path: 'meshratelimits',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'MeshRetry',
          path: 'meshretries',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'MeshTimeout',
          path: 'meshtimeouts',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'MeshTrace',
          path: 'meshtraces',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'MeshTrafficPermission',
          path: 'meshtrafficpermissions',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'ProxyTemplate',
          path: 'proxytemplates',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'RateLimit',
          path: 'rate-limits',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'Retry',
          path: 'retries',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'Timeout',
          path: 'timeouts',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'TrafficLog',
          path: 'traffic-logs',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'TrafficPermission',
          path: 'traffic-permissions',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'TrafficRoute',
          path: 'traffic-routes',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'TrafficTrace',
          path: 'traffic-traces',
          readOnly: false,
          isExperimental: false,
        },
        {
          name: 'VirtualOutbound',
          path: 'virtual-outbounds',
          readOnly: false,
          isExperimental: false,
        },
      ],

    },
  }
}
