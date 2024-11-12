import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const total = fake.number.int(200)

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: total }).map((_, i) => {
        const name = `${fake.hacker.noun()}-${i}`
        return {
          type: 'TrafficLog',
          mesh: params.mesh,
          name,
          sources: [
            {
              match: {
                service: `${fake.hacker.noun()}`,
                version: '1.0',
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
            backend: 'file',
          },
        }
      }),
      next: null,
    },
  }
}
