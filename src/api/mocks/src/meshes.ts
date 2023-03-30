import type { EndpointDependencies, MockResponder } from '@/api/mocks/index'
export default ({ fake }: EndpointDependencies): MockResponder => (_req) => {
  const total = fake.datatype.number({ min: 1, max: 20 })
  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: total }).map((_, i) => {
        const name = i === 0 ? 'default' : `${fake.hacker.noun()}-${i}`

        return {
          name,
          type: 'Mesh',
          creationTime: '2020-06-19T12:18:02.097986-04:00',
          modificationTime: '2020-06-19T12:18:02.097986-04:00',
          mtls: {
            enabledBackend: 'ca-1',
            backends: [
              {
                name: 'ca-1',
                type: 'provided',
                dpCert: {
                  rotation: {
                    expiration: '1d',
                  },
                },
                conf: {
                  cert: {
                    secret: 'name-of-secret',
                  },
                  key: {
                    secret: 'name-of-secret',
                  },
                },
              },
              {
                name: 'ca-2',
                type: 'BUILTIN',
              },
            ],
          },
        }
      }),
      next: null,
    },
  }
}
