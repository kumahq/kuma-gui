import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { components } from '@/types/auto-generated.d'
type InspectRules = components['schemas']['InspectRules']

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
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const hasProxyRuleOverride = env('KUMA_DATAPLANE_PROXY_RULE_ENABLED', '')
  const hasProxyRule = hasProxyRuleOverride !== '' ? hasProxyRuleOverride === 'true' : fake.datatype.boolean()
  const ruleCount = parseInt(env('KUMA_DATAPLANE_RULE_COUNT', `${fake.number.int({ min: 1, max: 5 })}`))
  const matcherCount = parseInt(env('KUMA_RULE_MATCHER_COUNT', `${fake.number.int({ min: 1, max: 5 })}`))
  const toRuleCount = parseInt(env('KUMA_DATAPLANE_TO_RULE_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))
  const fromRuleCount = parseInt(env('KUMA_DATAPLANE_FROM_RULE_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))
  const toResourceRuleCount = fake.number.int({ min: 1, max: 3 })
  const ruleMatchCount = parseInt(env('KUMA_RULE_MATCH_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))

  const parts = String(name).split('.')
  const displayName = parts.slice(0, -1).join('.')
  const nspace = parts.pop()

  return {
    headers: {},
    body: {
      httpMatches: [],
      resource: {
        type: 'Dataplane',
        mesh,
        name,
        labels: {
          'kuma.io/display-name': displayName,
          'kuma.io/origin': fake.kuma.origin(),
          'kuma.io/zone': fake.hacker.noun(),
          ...(k8s
            ? {
              'k8s.kuma.io/namespace': nspace,
            }
            : {}),
        },
      },
      rules: [
        ...Array.from({ length: ruleCount }).map(() => {
          return {
            type: fake.kuma.policyName(),
            toResourceRules: Array.from({ length: toResourceRuleCount }).map(() => {
              const clusterName = env('KUMA_CLUSTER_NAME', `${fake.hacker.noun()}_${fake.hacker.noun()}_${fake.hacker.noun()}_${fake.hacker.noun()}_${fake.helpers.arrayElement(['msvc', 'mzsvc', 'extsvc'])}_${fake.number.int({ min: 1, max: 65535 })}`)
              const [mesh, service, nspace, zone] = clusterName.split('_')

              return {
                resourceMeta: {
                  type: 'MeshService',
                  mesh,
                  name,
                  labels: {
                    'kuma.io/display-name': service,
                    'kuma.io/origin': fake.kuma.origin(),
                    'kuma.io/zone': zone,
                    ...(k8s
                      ? {
                        'k8s.kuma.io/namespace': nspace,
                      }
                      : {}),

                  },
                },
                resourceSectionName: '',
                origin: Array.from({ length: fake.number.int({ min: 1, max: 3 }) }).map(() => {
                  const displayName = fake.hacker.noun()
                  const nspace = fake.k8s.namespace()
                  const id = `${name}.${nspace}`
                  return {
                    resourceMeta: {
                      type: fake.kuma.policyName(),
                      mesh,
                      name: id,
                      labels: {
                        'kuma.io/display-name': displayName,
                        'kuma.io/origin': fake.kuma.origin(),
                        'kuma.io/zone': fake.hacker.noun(),
                        ...(k8s
                          ? {
                            'k8s.kuma.io/namespace': nspace,
                          }
                          : {}),
                      },
                    },
                  }
                }),
                conf: [{
                  http: {
                    requestTimeout: '15s',
                  },
                }],
              }
            }),
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
                        type: fake.kuma.policyName(),
                        labels: {},
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
                    type: fake.kuma.policyName(),
                    labels: {},
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
              }
            }),
          }
        }),
        ...(hasProxyRule
          ? [{
            type: 'MeshProxyPatch',
            proxyRule: {
              conf: {},
              origin: [
                {
                  type: 'MeshProxyPatch',
                  mesh: 'default',
                  name: 'mpp-on-gateway',
                  labels: {},
                },
              ],
            },
          }]
          : []),
      ],
    } satisfies InspectRules,
  }
}
