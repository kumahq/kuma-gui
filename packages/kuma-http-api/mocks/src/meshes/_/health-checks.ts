import type { Dependencies, ResponseHandler } from '#mocks'
export default ({ fake }: Dependencies): ResponseHandler => (req) => {
  const params = req.params
  const total = fake.number.int(200)

  const queryName = req.url.searchParams.get('name')

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: total }).map((_, i) => {
        const name = `${queryName?.padEnd(queryName.length + 1, '-') ?? ''}${fake.word.noun()}-${i}`
        return {
          type: 'HealthCheck',
          mesh: params.mesh,
          name,
          sources: [
            {
              match: {
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
