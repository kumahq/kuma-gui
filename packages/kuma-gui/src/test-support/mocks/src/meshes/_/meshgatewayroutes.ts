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
