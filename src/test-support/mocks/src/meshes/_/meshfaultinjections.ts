import type { EndpointDependencies, MockResponder } from '@/test-support'

export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const total = fake.number.int(200)

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: total }).map((_, i) => {
        const name = `${fake.hacker.noun()}-${i}`

        return {
          type: 'MeshFaultInjection',
          mesh: params.mesh,
          name,
          creationTime: '2022-01-25T13:58:29.381342+01:00',
          modificationTime: '2022-01-25T13:58:29.381342+01:00',
          spec: {
            targetRef: {
              kind: 'MeshService',
              name: fake.hacker.noun(),
            },
            from: [
              {
                targetRef: {
                  kind: 'MeshService',
                  name: fake.hacker.noun(),
                },
                default: {
                  http: [
                    {
                      abort: {
                        httpStatus: 500,
                        percentage: 50,
                      },
                    },
                  ],
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
