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
          type: 'Retry',
          mesh: params.mesh,
          name,
          creationTime: '2021-07-29T10:18:49.955186+02:00',
          modificationTime: '2021-07-29T10:18:49.955186+02:00',
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
            http: {
              numRetries: 5,
              perTryTimeout: '16s',
              backOff: {
                baseInterval: '0.025s',
                maxInterval: '0.250s',
              },
            },
            tcp: {
              maxConnectAttempts: 5,
            },
            grpc: {
              numRetries: 5,
              perTryTimeout: '16s',
              backOff: {
                baseInterval: '0.025s',
                maxInterval: '0.250s',
              },
            },
          },
        }
      }),
      next: null,
    },
  }
}
