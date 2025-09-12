import type { Dependencies, ResponseHandler } from '#mocks'
export default ({ fake }: Dependencies): ResponseHandler => (req) => {
  const params = req.params
  return {
    headers: {},
    body: {
      ...(req.url.searchParams.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'FaultInjection',
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
