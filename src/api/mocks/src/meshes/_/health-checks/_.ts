import type { EndpointDependencies, MockResponder } from '@/api/mocks/index'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  return {
    headers: {},
    body: {
      type: 'HealthCheck',
      mesh: params.mesh,
      name: params.name,
      sources: [
        {
          match: {
            service: fake.hacker.noun(),
          },
        },
      ],
      destinations: [
        {
          match: {
            service: fake.hacker.noun(),
          },
        },
      ],
      conf: {
        activeChecks: {
          interval: '10s',
          timeout: '2s',
          unhealthyThreshold: 3,
          healthyThreshold: 4,
        },
      },
    },
  }
}
