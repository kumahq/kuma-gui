import type { EndpointDependencies, MockResponder } from '@/api/mocks/index'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  return {
    headers: {},
    body: {
      type: 'FaultInjection',
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
      },
    },
  }
}
