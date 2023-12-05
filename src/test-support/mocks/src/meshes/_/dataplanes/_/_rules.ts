import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { InspectRulesForDataplane } from '@/types/index.d'

export default ({ env, fake }: EndpointDependencies): MockResponder => (req) => {
  const mesh = req.params.mesh as string
  const name = req.params.name as string

  const haxProxyRuleOverride = env('KUMA_DATAPLANE_PROXY_RULE_ENABLED', '')
  const haxProxyRule = haxProxyRuleOverride !== '' ? haxProxyRuleOverride === 'true' : fake.datatype.boolean()
  const ruleCount = parseInt(env('KUMA_DATAPLANE_RULE_COUNT', `${fake.number.int({ min: 1, max: 5 })}`))
  const toRuleCount = parseInt(env('KUMA_DATAPLANE_TO_RULE_COUNT', `${fake.number.int({ min: 0, max: 3 })}`))
  const fromRuleCount = parseInt(env('KUMA_DATAPLANE_FROM_RULE_COUNT', `${fake.number.int({ min: 0, max: 3 })}`))

  return {
    headers: {},
    body: {
      resource: {
        type: 'Dataplane',
        mesh,
        name,
      },
      rules: [
        ...haxProxyRule
          ? [{
            type: 'MeshProxyPatch',
            proxyRule: {
              conf: {
                appendModifications: [
                  {
                    cluster: {
                      operation: 'Add',
                      value: 'name: test-cluster\nconnectTimeout: 5s\ntype: STATIC',
                    },
                  },
                ],
              },
              origin: [
                {
                  mesh: 'default',
                  name: 'mpp-on-gateway',
                  type: 'MeshProxyPatch',
                },
              ],
            },
          }]
          : [],
        ...Array.from({ length: ruleCount }).map(() => {
          const type = fake.helpers.arrayElement(['MeshHTTPRoute', 'MeshTimeout'])

          return {
            type,
            fromRules: Array.from({ length: fromRuleCount }).map(() => {
              return {
                inbound: {
                  port: fake.internet.port(),
                  tags: fake.kuma.tags({ service: fake.kuma.serviceName('internal') }),
                },
                rules: Array.from({ length: fake.number.int({ min: 1, max: 3 }) }).map(() => {
                  return {
                    matchers: [
                      {
                        key: 'kuma.io/service',
                        not: fake.datatype.boolean(),
                        value: fake.kuma.serviceName('internal'),
                      },
                    ],
                    origin: [
                      {
                        mesh,
                        name: 'the-http-route',
                        type,
                      },
                    ],
                    conf: {
                      http: {
                        requestTimeout: '15s',
                      },
                    },
                  }
                }),
              }
            }),
            toRules: Array.from({ length: toRuleCount }).map(() => {
              const service1 = fake.kuma.serviceName('internal')

              return {
                matchers: [
                  {
                    key: 'kuma.io/service',
                    not: fake.datatype.boolean(),
                    value: service1,
                  },
                ],
                origin: [
                  {
                    mesh,
                    name: 'the-other-http-route',
                    type,
                  },
                ],
                conf: {
                  Rules: [
                    {
                      matches: [
                        {
                          path: {
                            value: '/api',
                            type: 'PathPrefix',
                          },
                        },
                      ],
                      default: {
                        backendRefs: [
                          {
                            kind: 'MeshServiceSubset',
                            name: service1,
                            tags: {
                              version: '1.0',
                            },
                          },
                          {
                            kind: 'MeshServiceSubset',
                            name: 'other-svc-2',
                            tags: {
                              version: '1.0',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              }
            }),
          }
        }),
      ],
    } satisfies InspectRulesForDataplane,
  }
}
