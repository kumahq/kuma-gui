import { describe, expect, test } from '@jest/globals'

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
    [
      `type: MeshOPA
mesh: default
name: opa-1.kong-mesh-system
spec:
  targetRef:
    kind: MeshService
    name: backend_kuma-demo_svc_3001
  default:
    appendPolicies:
      - inlineString: "package envoy.authz\\n\\nimport input.attributes.request.http as http_request\\n\\ndefault allow = false\\n\\ntoken = {\\"valid\\": valid, \\"payload\\": payload} {\\n    [_, encoded] := split(http_request.headers.authorization, \\" \\")\\n    [valid, _, payload] := io.jwt.decode_verify(encoded, {\\"secret\\": \\"secret\\"})\\n}\\n\\nallow {\\n    is_token_valid\\n    action_allowed\\n}\\n\\nis_token_valid {\\n  token.valid\\n  now := time.now_ns() / 1000000000\\n  token.payload.nbf <= now\\n  now < token.payload.exp\\n}\\n\\naction_allowed {\\n  http_request.method == \\"GET\\"\\n  token.payload.role == \\"admin\\"\\n}\\n"`,
      `type: MeshOPA
mesh: default
name: opa-1.kong-mesh-system
spec:
  targetRef:
    kind: MeshService
    name: backend_kuma-demo_svc_3001
  default:
    appendPolicies:
      - inlineString: |
          package envoy.authz

          import input.attributes.request.http as http_request

          default allow = false

          token = {\\"valid\\": valid, \\"payload\\": payload} {
              [_, encoded] := split(http_request.headers.authorization, \\" \\")
              [valid, _, payload] := io.jwt.decode_verify(encoded, {\\"secret\\": \\"secret\\"})
          }

          allow {
              is_token_valid
              action_allowed
          }

          is_token_valid {
            token.valid
            now := time.now_ns() / 1000000000
            token.payload.nbf <= now
            now < token.payload.exp
          }

          action_allowed {
            http_request.method == \\"GET\\"
            token.payload.role == \\"admin\\"
          }`,
    ],
  ])('works', (yaml, expectedFormattedYaml) => {
    expect(reformatYaml(yaml)).toBe(expectedFormattedYaml)
  })
})
