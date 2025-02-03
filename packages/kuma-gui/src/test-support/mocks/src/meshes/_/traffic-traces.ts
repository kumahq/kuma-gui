import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const total = fake.number.int(200)

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: total }).map((_, i) => {
        const name = `${fake.word.noun()}-${i}`
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
            backend: `${fake.word.noun()}`,
          },
        }
      }),
      next: null,
    },
  }
}
