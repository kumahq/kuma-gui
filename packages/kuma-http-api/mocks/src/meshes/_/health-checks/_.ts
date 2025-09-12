import type { Dependencies, ResponseHandler } from '#mocks'
export default ({ fake }: Dependencies): ResponseHandler => (req) => {
  const params = req.params
  return {
    headers: {},
    body: {
      ...(req.url.searchParams.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'HealthCheck',
      mesh: params.mesh,
      name: params.name,
      sources: [
        {
          match: {
            service: fake.word.noun(),
          },
        },
      ],
      destinations: [
        {
          match: {
            service: fake.word.noun(),
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
