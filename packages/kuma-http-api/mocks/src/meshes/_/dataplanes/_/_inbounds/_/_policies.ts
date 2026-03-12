import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'

type InboundPoliciesList = components['schemas']['InboundPoliciesList']
type InboundPolicyConf = components['schemas']['InboundPolicyConf']

export default ({ env, fake }: Dependencies): ResponseHandler => (req) => {
  const mesh = req.params.mesh as string
  const ruleCount = parseInt(env('KUMA_DATAPLANE_RULE_COUNT', `${fake.number.int({ min: 1, max: 5 })}`))
  return {
    headers: {},
    body: {
      policies: Array.from({ length: fake.number.int({ min: 1, max: 10 })}).map(() => {
        const kind = fake.kuma.policyName()
        const kri = fake.kuma.kri({ resourceName: kind, mesh })
        return {
          kind,
          rules: Array.from({ length: ruleCount }).map(() => {
            return {
              conf: (() => {
                switch(kind) {
                  case 'MeshLoadBalancingStrategy':
                    return {
                      to: [
                        {
                          targetRef: {
                            kind: 'MeshService',
                            name: fake.word.noun(),
                          },
                          default: {
                            loadBalancer: fake.helpers.arrayElement([
                              {
                                type: 'LeastRequest',
                                leastRequest: {
                                  choiceCount: fake.number.int({ min: 2, max: 8 }),
                                },
                              },
                              {
                                type: 'RingHash',
                                ringHash: {
                                  hashFunction: fake.helpers.arrayElement(['XX_HASH', 'MURMUR_HASH_2']),
                                  minRingSize: fake.number.int({ min: 1024, max: 4096 }),
                                  hashPolicies: [
                                    {
                                      type: 'Header',
                                      header: {
                                        name: fake.helpers.arrayElement(['x-session-id', 'x-user-id', 'authorization']),
                                      },
                                    },
                                  ],
                                },
                              },
                              {
                                type: fake.helpers.arrayElement(['Random', 'RoundRobin', 'Maglev']),
                              }
                            ]),
                            localityAwareness: {
                              disabled: fake.datatype.boolean(),
                              localZone: {
                                affinityTags: [
                                  {
                                    key: fake.helpers.arrayElement(['k8s.io/node', 'k8s.io/az', 'topology.kubernetes.io/zone']),
                                    weight: fake.number.int({ min: 1, max: 100 }),
                                  },
                                ],
                              },
                            },
                          },
                        },
                      ],
                    }
                  case 'MeshCircuitBreaker':
                    return {
                      connectionLimits: {
                        maxConnections: fake.number.int({ min: 10, max: 100 }),
                        maxPendingRequests: fake.number.int({ min: 5, max: 50 }),
                        maxRequests: fake.number.int({ min: 100, max: 1000 }),
                        maxRetries: fake.number.int({ min: 1, max: 5 }),
                      },
                      outlierDetection: {
                        interval: '30s',
                        baseEjectionTime: '30s',
                        maxEjectionPercent: fake.number.int({ min: 10, max: 50 }),
                        detectors: {
                          totalFailures: {
                            consecutive: fake.number.int({ min: 5, max: 15 }),
                          },
                          gatewayFailures: {
                            consecutive: fake.number.int({ min: 3, max: 10 }),
                          },
                        },
                      },
                    }
                  case 'MeshFaultInjection':
                    return {
                      http: [
                        {
                          delay: {
                            percentage: fake.number.int({ min: 1, max: 50 }),
                            value: `${fake.number.int({ min: 1, max: 5 })}s`,
                          },
                          abort: {
                            percentage: fake.number.int({ min: 1, max: 30 }),
                            httpStatus: fake.helpers.arrayElement([400, 404, 500, 502, 503]),
                          },
                          responseBandwidth: {
                            percentage: fake.number.int({ min: 10, max: 40 }),
                            limit: `${fake.number.int({ min: 10, max: 100 })}kbps`,
                          },
                        },
                      ],
                    }
                  case 'MeshHealthCheck':
                    return {
                      to: [
                        {
                          targetRef: {
                            kind: 'MeshService',
                            name: fake.word.noun(),
                          },
                          default: {
                            interval: `${fake.number.int({ min: 5, max: 30 })}s`,
                            timeout: `${fake.number.int({ min: 1, max: 5 })}s`,
                            unhealthyThreshold: fake.number.int({ min: 2, max: 5 }),
                            healthyThreshold: fake.number.int({ min: 1, max: 3 }),
                            http: {
                              path: fake.helpers.arrayElement(['/health', '/healthz', '/status', '/ping']),
                              expectedStatuses: [200, 201],
                              requestHeadersToAdd: {
                                set: [
                                  {
                                    name: 'x-health-check',
                                    value: 'true',
                                  },
                                ],
                              },
                            },
                          },
                        },
                      ],
                    }
                  default:
                    return {}
                }
              })(),
              kri,
            }
          }),
          origins: Array.from({ length: fake.number.int({ min: 1, max: 3 })}).map(() => {
            return {
              kri,
            }
          }),
        }
      }) satisfies InboundPolicyConf[],
    } satisfies InboundPoliciesList,
  }
}
