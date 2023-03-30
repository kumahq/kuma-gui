import type { EndpointDependencies, MockResponder } from '@/api/mocks/index'
export default (_deps: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  return {
    headers: {},
    body: {
      type: 'CircuitBreaker',
      mesh: params.mesh,
      name: params.name,
      creationTime: '2020-06-02T00:24:05.038029+07:00',
      modificationTime: '2020-06-02T00:24:05.038029+07:00',
      sources: [
        {
          match: {
            region: 'us',
            service: 'frontend',
          },
        },
      ],
      destinations: [
        {
          match: {
            service: 'backend',
          },
        },
      ],
      conf: {
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
      },

    },
  }
}
