import type { Dependencies, ResponseHandler } from '#mocks'
import type { paths } from '@kumahq/kuma-http-api'

type MeshZoneAddressResponse = paths['/meshes/{mesh}/meshzoneaddresses/{name}']['get']['responses']['200']['content']['application/json']

export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  // this template can be called via the /_kri/kri_<shortName>_:kri endpoint or
  // the legacy endpoint
  const kri = req.params.kri ? `kri_mza_${req.params.kri}` : undefined
  const [
    _prefix,
    shortName,
    mesh,
    zone,
    nspace,
    displayName,
  ] = kri ? kri.split('_') : [
    'kri', // prefix
    'mza', // shortName
    String(req.params.mesh), // mesh
    fake.word.noun(), // zone, a MeshZoneAddress is always zone scoped
    // with k8s the request.name MUST be use the correct `name.ns` format
    ...(k8s ? String(req.params.name).split('.').toReversed() : ['', String(req.params.name)]), // nspace, displayName
  ]
  const name = kri ? `${displayName}${nspace ? `.${nspace}` : ''}` : String(req.params.name)

  const k8sFormat = req.url.searchParams.get('format') === 'kubernetes'
  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      ...(k8sFormat ? { apiVersion: 'kuma.io/v1alpha1' } : {}),
      ...fake.kuma.timespan(),
      type: 'MeshZoneAddress',
      mesh,
      name,
      kri: fake.kuma.kri({ shortName, mesh, zone, namespace: nspace, displayName }),
      ...((() => {
        const metadata = {
          mesh,
          name,
          labels: {
            ...fake.kuma.labels({
              name: displayName,
              mesh,
              env: k8s ? 'kubernetes' : 'universal',
              ...(zone ? { zone } : {}),
              ...(k8s ? { namespace: nspace } : {}),
            }),
          },
        }
        return k8sFormat ? { metadata } : metadata
      })()),
      spec: {
        address: fake.internet.ip(),
        port: fake.internet.port(),
      },
    } satisfies MeshZoneAddressResponse,
  }
}
