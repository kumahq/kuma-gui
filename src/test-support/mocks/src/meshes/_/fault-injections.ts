import type { EndpointDependencies, MockResponder } from '@/test-support/fake'
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
          type: 'FaultInjection',
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
        }
      }),
      next: null,
    },
  }
}
