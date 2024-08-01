import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { InspectBaseRule, InspectRulesForDataplane } from '@/types/index.d'

export default ({ env, fake }: EndpointDependencies): MockResponder => (req) => {
  const mesh = req.params.mesh as string
  const name = req.params.name as string

  // use a seed based on the name to keep ports and ip address the same across
  // _overview, stats and rules
  fake.kuma.seed(name as string)
  const inboundCount = parseInt(env('KUMA_DATAPLANEINBOUND_COUNT', `${fake.number.int({ min: 1, max: 10 })}`))
  const ports = Array.from({ length: inboundCount }).map(() => ({
    port: fake.number.int({ min: 1, max: 65535 }),
    protocol: fake.kuma.protocol(),
  }))
  //

  fake.kuma.seed()
  const hasProxyRuleOverride = env('KUMA_DATAPLANE_PROXY_RULE_ENABLED', '')
  const hasProxyRule = hasProxyRuleOverride !== '' ? hasProxyRuleOverride === 'true' : fake.datatype.boolean()
  const ruleCount = parseInt(env('KUMA_DATAPLANE_RULE_COUNT', `${fake.number.int({ min: 1, max: 5 })}`))
  const matcherCount = parseInt(env('KUMA_RULE_MATCHER_COUNT', `${fake.number.int({ min: 1, max: 5 })}`))
  const toRuleCount = parseInt(env('KUMA_DATAPLANE_TO_RULE_COUNT', `${fake.number.int({ min: 0, max: 3 })}`))
  const fromRuleCount = parseInt(env('KUMA_DATAPLANE_FROM_RULE_COUNT', `${fake.number.int({ min: 0, max: 3 })}`))
  const resourceRuleCount = parseInt(env('KUMA_DATAPLANE_RESOURCE_RULE_COUNT', `${fake.number.int({ min: 0, max: 3 })}`))
  const ruleMatchCount = parseInt(env('KUMA_RULE_MATCH_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  return {
    headers: {},
    body: {
      resource: {
        type: 'Dataplane',
        mesh,
        name,
      },
      toResourceRules: Array.from({ length: resourceRuleCount }).map((_, i) => {
        const id = i
        const displayName = `${fake.hacker.noun()}-${id}`
        const nspace = fake.k8s.namespace()
        return {
          resourceMeta: {
            type: fake.helpers.arrayElement([
              'MeshService',
              'MeshExternalService',
              'MeshGateway',
              'MeshHTTPRoute',
              'MeshTCPRoute',
            ]),
            mesh,
            name: `${displayName}${k8s ? `.${nspace}` : ''}`,
            ...(k8s
              ? {
                labels: {
                  'kuma.io/display-name': displayName,
                  'k8s.kuma.io/namespace': nspace,
                  'kuma.io/origin': 'zone',
                  'kuma.io/zone': fake.hacker.noun(),
                },
              }
              : {}),
          },
          conf: '',
          origin: {
            resourceMeta: {
              type: 'MeshTimeout',
              mesh,
              name: fake.hacker.noun(),
              labels: {},
            },
            ruleIndex: 0, // fake.number.int({ min: 0, max: ruleCount }),
          },
        }
      }),
      rules: [
        ...(hasProxyRule
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
          : []),
        ...Array.from({ length: ruleCount }).map(() => {
          const type = fake.helpers.arrayElement(['MeshHTTPRoute', 'MeshTimeout'])

          return {
            type,
            fromRules: Array.from({ length: fromRuleCount }).map(() => {
              return {
                inbound: {
                  port: ports[fake.number.int({ min: 0, max: ports.length - 1 })].port,
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
                  }
                }),
              }
            }),
            toRules: Array.from({ length: toRuleCount }).map(() => {
              const service1 = fake.kuma.serviceName('internal')

              return {
                matchers: Array.from({ length: matcherCount }).map(() => ({
                  key: 'kuma.io/service',
                  not: fake.datatype.boolean(),
                  value: service1,
                })),
                origin: [
                  {
                    mesh,
                    name: 'the-other-http-route',
                    type,
                  },
                ],
                conf: {
                  rules: [
                    {
                      matches: Array.from({ length: ruleMatchCount }).map(() => fake.kuma.ruleMatch()),
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
              } satisfies InspectBaseRule
            }),
          }
        }),
      ],
    } satisfies InspectRulesForDataplane,
  }
}
