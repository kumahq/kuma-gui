import { reformatYaml } from './reformatYaml'

describe('reformatYaml', () => {
  test.each([
    [
      `type: ProxyTemplate
mesh: default
name: pt-1
selectors:
  - match:
      service: backend
conf:
  imports:
    - default-proxy
  resources:
    - name: raw-name
      version: raw-version
      resource: "'@type': type.googleapis.com/envoy.api.v2.Cluster\\nconnectTimeout: 5s\\nloadAssignment:\\n  clusterName: localhost:8443\\n  endpoints:\\n    - lbEndpoints:\\n        - endpoint:\\n            address:\\n              socketAddress:\\n                address: 127.0.0.1\\n                portValue: 8443\\nname: localhost:8443\\ntype: STATIC\\n"
      test: 1
      another: "'@type': type.googleapis.com/envoy.api.v2.Cluster\\nconnectTimeout: 5s\\n"`,
      `type: ProxyTemplate
mesh: default
name: pt-1
selectors:
  - match:
      service: backend
conf:
  imports:
    - default-proxy
  resources:
    - name: raw-name
      version: raw-version
      resource: |
        '@type': type.googleapis.com/envoy.api.v2.Cluster
        connectTimeout: 5s
        loadAssignment:
          clusterName: localhost:8443
          endpoints:
            - lbEndpoints:
                - endpoint:
                    address:
                      socketAddress:
                        address: 127.0.0.1
                        portValue: 8443
        name: localhost:8443
        type: STATIC
      test: 1
      another: |
        '@type': type.googleapis.com/envoy.api.v2.Cluster
        connectTimeout: 5s`,
    ],
    [
      'another: "\'@type\': type.googleapis.com/envoy.api.v2.Cluster\\nconnectTimeout: 5s"',
      `another: |
  '@type': type.googleapis.com/envoy.api.v2.Cluster
  connectTimeout: 5s`,
    ],
    [
      'another: "\'@type\': type.googleapis.com/envoy.api.v2.Cluster"',
      'another: "\'@type\': type.googleapis.com/envoy.api.v2.Cluster"',
    ],
  ])('works', (yaml, expectedFormattedYaml) => {
    expect(reformatYaml(yaml)).toBe(expectedFormattedYaml)
  })
})
