import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const total = fake.datatype.number(200)

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: total }).map((_, i) => {
        const name = `${fake.hacker.noun()}-${i}`
        return {
          type: 'HealthCheck',
          mesh: params.mesh,
          name,
          sources: [
            {
              match: {
                service: `${fake.hacker.noun()}`,
              },
            },
          ],
          destinations: [
            {
              match: {
                service: `${fake.hacker.noun()}`,
              },
            },
          ],
          conf: {
            activeChecks: {
              interval: '10s',
              timeout: '2s',
              unhealthyThreshold: 3,
              healthyThreshold: 1,
            },
          },
        }
      }),
      next: null,
    },
  }
}
