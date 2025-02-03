import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const total = fake.number.int(200)

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: total }).map((_, i) => {
        const name = `${fake.word.noun()}-${i}`
        return {
          type: 'ProxyTemplate',
          mesh: params.mesh,
          name,
          selectors: [
            {
              match: {
                service: `${fake.word.noun()}`,
              },
            },
          ],
          conf: {
            imports: [
              'default-proxy',
            ],
            resources: [
              {
                name: 'raw-name',
                version: 'raw-version',
                resource: "'@type': type.googleapis.com/envoy.api.v2.Cluster\nconnectTimeout: 5s\nloadAssignment:\n  clusterName: localhost:8443\n  endpoints:\n    - lbEndpoints:\n        - endpoint:\n            address:\n              socketAddress:\n                address: 127.0.0.1\n                portValue: 8443\nname: localhost:8443\ntype: STATIC\n",
              },
            ],
          },
        }
      }),
      next: null,
    },
  }
}
