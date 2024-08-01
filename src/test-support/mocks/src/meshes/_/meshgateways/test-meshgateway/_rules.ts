import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { InspectRulesForDataplane } from '@/types/index.d'

export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const mesh = req.params.mesh as string
  const name = req.params.name as string

  return {
    headers: {},
    body: {
      resource: {
        mesh,
        name,
        type: 'MeshGateway',
      },
      toResourceRules: [],
      rules: [
        {
          fromRules: [],
          toRules: [
            {
              conf: {
                rules: [
                  {
                    matches: [
                      fake.kuma.ruleMatch({ kind: 'path' }),
                      fake.kuma.ruleMatch({ kind: 'method' }),
                    ],
                    default: {
                      filters: [
                        {
                          type: 'RequestHeaderModifier',
                          requestHeaderModifier: {
                            remove: [
                              'X-Token',
                            ],
                          },
                        },
                        {
                          type: 'ResponseHeaderModifier',
                          responseHeaderModifier: {
                            add: [
                              { name: 'Header-1', value: 'value-1' },
                              { name: 'Header-2', value: 'value-2' },
                            ],
                            remove: [
                              'Test',
                            ],
                          },
                        },
                      ],
                      backendRefs: [
                        {
                          kind: 'MeshService',
                          name: 'demo-app_kuma-demo_svc_5000',
                          weight: 1,
                        },
                      ],
                    },
                  },
                  {
                    matches: [
                      fake.kuma.ruleMatch({ kind: 'path' }),
                      fake.kuma.ruleMatch({ kind: 'queryParams' }),
                    ],
                    default: {
                      filters: [
                        {
                          type: 'RequestMirror',
                          requestMirror: {
                            backendRef: {
                              kind: 'MeshService',
                              name: 'service-9001',
                            },
                            percentage: 50,
                          },
                        },
                      ],
                      backendRefs: [
                        {
                          kind: 'MeshService',
                          name: 'demo-app_kuma-demo_svc_5000',
                          weight: 1,
                        },
                        {
                          kind: 'MeshServiceSubset',
                          name: 'service-2',
                          tags: {
                            version: 'v1',
                          },
                          weight: 2,
                        },
                      ],
                    },
                  },
                ],
              },
              matchers: [
                { key: 'listener', value: 'listener-0', not: false },
              ],
              origin: [
                {
                  mesh: 'default',
                  name: 'demo-app-1.kuma-system',
                  type: 'MeshHTTPRoute',
                },
                {
                  mesh: 'default',
                  name: 'demo-app-2.kuma-system',
                  type: 'MeshHTTPRoute',
                },
              ],
            },
            {
              conf: {
                rules: [
                  {
                    matches: [
                      fake.kuma.ruleMatch({ kind: 'headers' }),
                    ],
                    default: {
                      filters: [
                        {
                          type: 'URLRewrite',
                          urlRewrite: {
                            hostname: 'test.com',
                            hostToBackendHostname: true,
                            path: {
                              type: 'ReplaceFullPath',
                              replaceFullPath: 'bla',
                            },
                          },
                        },
                      ],
                      backendRefs: [
                        {
                          kind: 'MeshService',
                          name: 'demo-app_kuma-demo_svc_5000',
                          weight: 10,
                        },
                      ],
                    },
                  },
                ],
                hostnames: [
                  'bar.com',
                ],
              },
              matchers: [],
              origin: [
                {
                  mesh: 'default',
                  name: 'demo-app-1.kuma-system',
                  type: 'MeshHTTPRoute',
                },
                {
                  mesh: 'default',
                  name: 'demo-app-2.kuma-system',
                  type: 'MeshHTTPRoute',
                },
              ],
            },
          ],
          type: 'MeshHTTPRoute',
          warnings: [],
        },
        {
          fromRules: [],
          toRules: [
            {
              conf: {
                default: {
                  backendRefs: [
                    {
                      kind: 'MeshService',
                      name: 'demo-app_kuma-demo_svc_5000',
                      weight: 1,
                    },
                  ],
                },
              },
              matchers: [],
              origin: [
                {
                  mesh,
                  name: 'demo-app-4.kuma-system',
                  type: 'MeshTCPRoute',
                },
              ],
            },
          ],
          type: 'MeshTCPRoute',
          warnings: [],
        },
      ],
    } satisfies InspectRulesForDataplane,
  }
}
