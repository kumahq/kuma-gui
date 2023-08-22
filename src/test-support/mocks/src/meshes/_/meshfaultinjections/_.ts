import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const name = req.params.name
  const mesh = req.params.mesh

  return {
    headers: {},
    body: {
      type: 'MeshFaultInjection',
      mesh,
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
    },
  }
}
