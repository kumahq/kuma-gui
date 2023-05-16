import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, env, pager }: EndpointDependencies): MockResponder => (req) => {
  const { total, next, pageTotal } = pager(
    env('KUMA_MESH_COUNT', `${fake.number.int({ min: 1, max: 20 })}`),
    req,
    '/meshes',
  )
  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
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
      next,
    },
  }
}
