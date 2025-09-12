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
          type: 'MeshGatewayRoute',
          mesh: params.mesh,
          name,
          creationTime: '2022-01-25T13:58:29.381342+01:00',
          modificationTime: '2022-01-25T13:58:29.381342+01:00',
          selectors: [
            {
              match: {
                'kuma.io/service': name,
              },
            },
          ],
          conf: {
            http: {
              rules: [
                {
                  matches: [
                    {
                      path: {
                        match: 'PREFIX',
                        value: '/',
                      },
                    },
                  ],
                  backends: [
                    {
                      destination: {
                        'kuma.io/service': `${fake.word.noun()}`,
                      },
                    },
                  ],
                },
              ],
            },
          },
        }
      }),
      next: null,
    },
  }
}
