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
          type: 'MeshGateway',
          mesh: params.mesh,
          name,
          creationTime: '2022-01-25T13:55:51.798701+01:00',
          modificationTime: '2022-01-25T13:55:51.798701+01:00',
          selectors: [
            {
              match: {
                'kuma.io/service': name,
              },
            },
          ],
          conf: {
            listeners: [
              {
                hostname: 'foo.example.com',
                port: 8080,
                protocol: 'HTTP',
                tags: {
                  port: 'http/8080',
                },
              },
            ],
          },
        }
      }),
      next: null,
    },
  }
}
