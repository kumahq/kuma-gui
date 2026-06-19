import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'

export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  // this template can be called via the /_kri/kri_<shortName>_:kri endpoint or
  // the legacy endpoint
  const kri = req.params.kri ? `kri_wl_${req.params.kri}` : undefined
  const [
    _prefix,
    _shortName,
    mesh,
    zone,
    nspace,
    displayName,
  ] = kri ? kri.split('_') : [
    'kri', // prefix
    'wl', // shortName
    String(req.params.mesh), // mesh
    fake.helpers.arrayElement(['', fake.word.noun()]), // zone
    // with k8s the request.name MUST be use the correct `name.ns` format
    ...(k8s ? String(req.params.name).split('.').toReversed() : ['', String(req.params.name)]), // nspace, displayName
  ]
  const name = kri ? `${displayName}${nspace ? `.${nspace}` : ''}` : String(req.params.name)

  const k8sFormat = req.url.searchParams.get('format') === 'kubernetes'
  const creationTime = fake.date.past()

  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      ...(k8sFormat && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'Workload',
      mesh,
      kri: fake.kuma.kri({ resourceName: 'Workload', mesh, zone, namespace: nspace, name }),
      name,
      creationTime: creationTime.toISOString(),
      modificationTime: fake.date.between({ from: creationTime, to: Date.now() }).toISOString(),
      labels: {
        ...fake.kuma.labels({
          name: displayName,
          ...(zone ? { zone } : {}),
          ...(k8s ? { namespace: nspace } : {}),
        }),
      },
      spec: {},
      status: {
        dataplaneProxies: ((totalDataplaneProxies: number) => {
          const isHealthy = fake.datatype.boolean()
          return {
            connected: isHealthy ? totalDataplaneProxies : fake.number.int({ min: 0, max: Math.max(totalDataplaneProxies - 1, 0) }),
            healthy: isHealthy ? totalDataplaneProxies : fake.number.int({ min: 0, max: Math.max(totalDataplaneProxies - 1, 0) }),
            total: totalDataplaneProxies,
          }
        })(fake.number.int({ min: 0, max: 10 })),
      },
    } satisfies components['schemas']['WorkloadItem'],
  }
}
