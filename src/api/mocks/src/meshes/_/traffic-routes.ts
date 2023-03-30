import type { EndpointDependencies, MockResponder } from '@/api/mocks/index'
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
