import type { Dependencies, ResponseHandler } from '#mocks'
export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const kri = req.params.kri as string | undefined
  const [
    mesh = req.params.mesh as string,
    _zone,
    _namespace,
    name = req.params.name as string
  ] = kri?.split('_') ?? ''
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const parts = String(name).split('.')
  const displayName = parts.slice(0, -1).join('.')
  const nspace = parts.pop()

  return {
    headers: {},
    body: {
      type: 'MeshFaultInjection',
      mesh,
      name,
      creationTime: '2022-01-25T13:58:29.381342+01:00',
      modificationTime: '2022-01-25T13:58:29.381342+01:00',
      ...(k8s
        ? {
          labels: {
            'kuma.io/display-name': displayName,
            'k8s.kuma.io/namespace': nspace,
          },
        }
        : {}),
      spec: {
        from: [
          {
            targetRef: {
              kind: 'MeshService',
              name: fake.word.noun(),
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
