import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params

  const { offset, total, next, pageTotal } = pager(
    env('KUMA_CIRCUITBREAKER_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    `/meshes/${params.mesh}/circuit-breakers`,
  )

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const name = `${fake.word.noun()}-${id}`
        return {
          type: 'CircuitBreaker',
          mesh: params.mesh,
          name,
          creationTime: '2020-06-02T00:24:05.038029+07:00',
          modificationTime: '2020-06-02T00:24:05.038029+07:00',
          sources: [
            {
              match: {
                region: 'us',
                service: `${fake.word.noun()}`,
              },
            },
          ],
          destinations: [
            {
              match: {
                service: `${fake.word.noun()}`,
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
        }
      }),
      next,
    },
  }
}
