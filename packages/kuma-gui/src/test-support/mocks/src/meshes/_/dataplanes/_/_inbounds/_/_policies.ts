import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { components } from '@kumahq/kuma-http-api'

type InboundPoliciesList = components['schemas']['InboundPoliciesList']
type InboundPolicyConf = components['schemas']['InboundPolicyConf']

export default ({ env, fake }: EndpointDependencies): MockResponder => (req) => {
  const mesh = req.params.mesh as string
  const ruleCount = parseInt(env('KUMA_DATAPLANE_RULE_COUNT', `${fake.number.int({ min: 1, max: 5 })}`))
  return {
    headers: {},
    body: {
      policies: Array.from({ length: fake.number.int({ min: 1, max: 10 })}).map((_, i) => {
        const kind = fake.kuma.policyName()
        return {
          kind,
          rules: Array.from({ length: ruleCount }).map(() => {
            return {
              conf: (() => {
                switch(kind) {
                  case 'MeshGatewayRoute':
                    return {
                      http: {
                        rules: [
                          {
                            matches: [
                              {
                                path: {
                                  match: 'PREFIX',
                                  value: '/',
                                },
                              },
                            ],
                            backends: [
                              {
                                destination: {
                                  'kuma.io/service': fake.word.noun(),
                                },
                              },
                            ],
                          },
                        ],
                      },
                    }
                  case 'CircuitBreaker':
                    return {
                      interval: '1s',
                      baseEjectionTime: '30s',
                      maxEjectionPercent: 20,
                      detectors: {
                        totalErrors: {
                          consecutive: 20,
                        },
                        gatewayErrors: {
                          consecutive: 10,
                        },
                        localErrors: {
                          consecutive: 7,
                        },
                        standardDeviation: {
                          requestVolume: 10,
                          minimumHosts: 5,
                          factor: 1.9,
                        },
                        failure: {
                          requestVolume: 10,
                          minimumHosts: 5,
                          threshold: 85,
                        },
                      },
                    }
                  case 'FaultInjection':
                    return {
                      delay: {
                        percentage: 50,
                        value: '0.010s',
                      },
                      abort: {
                        percentage: 40,
                        httpStatus: 500,
                      },
                      responseBandwidth: {
                        percentage: 40,
                        limit: '50kbps',
                      },
                    }
                  case 'HealthCheck':
                    return {
                      activeChecks: {
                        interval: '10s',
                        timeout: '2s',
                        unhealthyThreshold: 3,
                        healthyThreshold: 1,
                      },
                    }
                  default:
                    return {}
                }
              })(),
            }
          }),
          origins: Array.from({ length: fake.number.int({ min: 1, max: 3 })}).map(() => {
            return {
              kri: fake.kuma.kri({ shortName: 'policy', mesh }),
            }
          }),
        }
      }) satisfies InboundPolicyConf[],
    } satisfies InboundPoliciesList,
  }
}
