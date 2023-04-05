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
          type: 'TrafficTrace',
          mesh: params.mesh,
          name,
          selectors: [
            {
              match: {
                service: '*',
              },
            },
          ],
          conf: {
            backend: `${fake.hacker.noun()}`,
          },
        }
      }),
      next: null,
    },
  }
}
