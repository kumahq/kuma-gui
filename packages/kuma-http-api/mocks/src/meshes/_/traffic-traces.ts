import type { Dependencies, ResponseHandler } from '#mocks'
export default ({ fake }: Dependencies): ResponseHandler => (req) => {
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
