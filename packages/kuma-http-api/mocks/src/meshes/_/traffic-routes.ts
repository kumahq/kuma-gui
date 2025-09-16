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
          type: 'TrafficRoute',
          mesh: params.mesh,
          name,
          creationTime: '2021-07-29T10:18:49.9545+02:00',
          modificationTime: '2021-07-29T10:18:49.9545+02:00',
          sources: [
            {
              match: {
                'kuma.io/service': '*',
              },
            },
          ],
          destinations: [
            {
              match: {
                'kuma.io/service': '*',
              },
            },
          ],
          conf: {
            loadBalancer: {
              roundRobin: {},
            },
            destination: {
              'kuma.io/service': '*',
            },
          },
        }
      }),
      next: null,
    },
  }
}
