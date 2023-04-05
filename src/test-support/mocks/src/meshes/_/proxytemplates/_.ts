import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  return {
    headers: {},
    body: {
      type: 'ProxyTemplate',
      mesh: params.mesh,
      name: params.name,
      selectors: [
        {
          match: {
            service: fake.hacker.noun(),
          },
        },
      ],
      conf: {
        imports: ['default-proxy'],
        resources: [
          {
            name: 'raw-name',
            version: 'raw-version',
            resource: "'@type': type.googleapis.com/envoy.api.v2.Cluster\nconnectTimeout: 5s\nloadAssignment:\n  clusterName: localhost:8443\n  endpoints:\n    - lbEndpoints:\n        - endpoint:\n            address:\n              socketAddress:\n                address: 127.0.0.1\n                portValue: 8443\nname: localhost:8443\ntype: STATIC\n",
          },
        ],
      },
    },
  }
}
