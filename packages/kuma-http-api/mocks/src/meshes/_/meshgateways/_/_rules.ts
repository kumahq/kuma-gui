import type { Dependencies, ResponseHandler } from '#mocks'
import type { InspectBaseRule, InspectRulesForDataplane } from '@/types/index.d'

export default ({ env, fake }: Dependencies): ResponseHandler => (req) => {
  const mesh = req.params.mesh as string
  const name = req.params.name as string

  const hasProxyRuleOverride = env('KUMA_DATAPLANE_PROXY_RULE_ENABLED', '')
  const hasProxyRule = hasProxyRuleOverride !== '' ? hasProxyRuleOverride === 'true' : fake.datatype.boolean()
  const ruleCount = parseInt(env('KUMA_DATAPLANE_RULE_COUNT', `${fake.number.int({ min: 1, max: 5 })}`))
  const matcherCount = parseInt(env('KUMA_RULE_MATCHER_COUNT', fake.datatype.boolean({ probability: 0.2 }) ? String(fake.number.int({ min: 0, max: 2 })) : '0'))
  const toRuleCount = parseInt(env('KUMA_DATAPLANE_TO_RULE_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))
  const fromRuleCount = parseInt(env('KUMA_DATAPLANE_FROM_RULE_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))
  const ruleMatchCount = parseInt(env('KUMA_RULE_MATCH_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))

  return {
    headers: {},
    body: {
      resource: {
        type: 'MeshGateway',
        mesh,
        name,
      },
      rules: [
        ...hasProxyRule
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
                    matchers: Array.from({ length: matcherCount }).map(() => ({
                      key: 'kuma.io/service',
                      not: fake.datatype.boolean(),
                      value: fake.kuma.serviceName('internal'),
                    })),
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
                  } satisfies InspectBaseRule
                }),
              }
            }),
            toRules: Array.from({ length: toRuleCount }).map((_, index) => {
              return {
                matchers: Array.from({ length: matcherCount }).map(() => ({
                  key: 'kuma.io/service',
                  not: index === 0 ? false : fake.datatype.boolean({ probability: 0.2 }),
                  value: index === 0 ? name : fake.kuma.serviceName('internal'),
                })),
                origin: [
                  {
                    mesh,
                    name: 'the-other-http-route',
                    type,
                  },
                ],
                conf: {
                  ...(fake.datatype.boolean() && { hostnames: ['foo.example.com'] }),
                  rules: [
                    {
                      matches: Array.from({ length: ruleMatchCount }).map(() => fake.kuma.ruleMatch()),
                      default: {
                        backendRefs: [
                          {
                            kind: 'MeshServiceSubset',
                            name: fake.kuma.serviceName('internal'),
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
              } satisfies InspectBaseRule
            }),
          }
        }),
      ],
    } satisfies InspectRulesForDataplane,
  }
}
