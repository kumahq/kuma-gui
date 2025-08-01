import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { components } from '@kumahq/kuma-http-api'

type OutboundPoliciesList = components['schemas']['PoliciesList']
type OutboundPolicyConf = components['schemas']['PolicyConf']

export default ({ env: _env, fake }: EndpointDependencies): MockResponder => (req) => {
  const mesh = req.params.mesh as string
  return {
    headers: {},
    body: {
      policies: Array.from({ length: fake.number.int({ min: 1, max: 10 })}).map((_, i) => {
        const kind = fake.kuma.policyName()
        return {
          kind,
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
          origins: Array.from({ length: fake.number.int({ min: 1, max: 3 })}).map(() => {
            return {
              kri: fake.kuma.kri({ shortName: 'policy', mesh }),
            }
          }),
        }
      }) satisfies OutboundPolicyConf[],
    } satisfies OutboundPoliciesList,
  }
}
