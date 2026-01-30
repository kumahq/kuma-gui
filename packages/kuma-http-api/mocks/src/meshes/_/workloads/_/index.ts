import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'

export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const kri = req.params.kri as string | undefined
  const [
    mesh = req.params.mesh as string,
    zone = fake.word.noun(),
    namespace = fake.word.noun(),
    name = req.params.name as string,
  ] = kri?.split('_') ?? []
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  const creationTime = fake.date.past()

  return {
    headers: {},
    body: {
      ...(req.url.searchParams.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'Workload',
      mesh,
      kri: fake.kuma.kri({ shortName: 'wl', mesh }),
      name,
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
    } satisfies components['schemas']['WorkloadItem'],
  }
}
