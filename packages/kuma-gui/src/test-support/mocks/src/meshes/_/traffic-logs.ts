import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const total = fake.number.int(200)

  const nameQuery = req.url.searchParams.get('name')

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: total }).map((_, i) => {
        const name = `${nameQuery?.padEnd(nameQuery.length + 1, '-') ?? ''}${fake.word.noun()}-${i}`
        return {
          type: 'TrafficLog',
          mesh: params.mesh,
          name,
          sources: [
            {
              match: {
                service: `${fake.word.noun()}`,
                version: '1.0',
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
            backend: 'file',
          },
        }
      }),
      next: null,
    },
  }
}
