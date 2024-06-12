import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const { mesh } = req.params
  const { name } = req.params
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_DATAPLANE_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    `/meshes/${mesh}/circuit-breakers/${name}/_resources/dataplanes`,
  )
  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const displayName = `${fake.hacker.noun()}-${id}${fake.kuma.dataplaneSuffix(k8s)}`
        const nspace = fake.k8s.namespace()

        return {
          type: 'Dataplane',
          mesh,
          name: `${displayName}${k8s ? `.${nspace}` : ''}`,
          ...(k8s
            ? {
              labels: {
                'kuma.io/display-name': displayName,
                'k8s.kuma.io/namespace': nspace,
              },
            }
            : {}),
        }
      }),
      next,
    },
  }
}
