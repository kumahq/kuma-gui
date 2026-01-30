import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'

export default ({ fake, env, pager }: Dependencies): ResponseHandler => (req) => {
  const { mesh } = req.params as Record<string, string>
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_WORKLOAD_COUNT', `${fake.number.int({ min: 1, max: 100 })}`),
    req,
    `/meshes/${mesh}/dataplanes/_overview`,
  )

  return {
    headers: {},
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }).map((_, index) => {
        const name = `${fake.word.noun()}-${offset + index + 1}`
        const namespace = fake.word.noun()
        const zone = fake.word.noun()
        const creationTime = fake.date.past()
        return {
          ...(req.url.searchParams.get('format') === 'kubernetes' && {
            apiVersion: 'kuma.io/v1alpha1',
          }),
          type: 'Workload',
          mesh,
          kri: fake.kuma.kri({ shortName: 'wl', mesh, zone, namespace, name }),
          name: `${name}.${namespace}`,
          creationTime: creationTime.toISOString(),
          modificationTime: fake.date.between({ from: creationTime, to: Date.now() }).toISOString(),
          labels: {
            'kuma.io/display-name': name,
            ...(k8s && { 'k8s.kuma.io/namespace': namespace }),
            'kuma.io/mesh': mesh,
            'kuma.io/zone': zone,
            'kuma.io/origin': fake.helpers.arrayElement(['zone', 'global']),
            'kuma.io/env': fake.helpers.arrayElement(['kubernetes', 'universal']),
          },
          spec: {},
          status: {
            dataplaneProxies: ((totalDataplaneProxies: number) => {
              const isHealthy = fake.datatype.boolean()
              return {
                connected: isHealthy ? totalDataplaneProxies : fake.number.int({ min: 0, max: totalDataplaneProxies - 1 }),
                healthy: isHealthy ? totalDataplaneProxies : fake.number.int({ min: 0, max: totalDataplaneProxies - 1 }),
                total: totalDataplaneProxies,
              }
            })(fake.number.int({ min: 1, max: 10 })),
          },
        }
      }),
    } satisfies components['responses']['WorkloadList']['content']['application/json'],
  }
}
