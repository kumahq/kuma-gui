import type { Dependencies, ResponseHandler } from '#mocks'
import type { paths } from '@kumahq/kuma-http-api'

type MeshTrustResponse = paths['/meshes/{mesh}/meshtrusts/{name}']['get']['responses']['200']['content']['application/json']

export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  // this template can be called via the /_kri/kri_<shortName>_:kri endpoint or
  // the legacy endpoint
  const kri = req.params.kri ? `kri_mtrust_${req.params.kri}` : undefined
  const [
    _prefix,
    _shortName,
    mesh,
    zone,
    // if its not a kri (which always has a nspace, even if it's ''), or the
    // name has no '.', then, if its k8s use a random nspace, otherwise ''
    nspace = k8s ? fake.word.noun() : '',
    displayName,
  ] = kri ? kri.split('_') : [
    'kri', // prefix
    'mtrust', // shortName
    String(req.params.mesh), // mesh
    fake.helpers.arrayElement(['', fake.word.noun()]), // zone
    ...String(req.params.name).split('.').toReversed(), // nspace, displayName
  ]
  const name = kri ? `${displayName}${nspace ? `.${nspace}` : ''}` : String(req.params.name)
  const namespace = fake.word.noun()

  const k8sFormat = req.url.searchParams.get('format') === 'kubernetes'
  return {
    headers: {},
    body: {
      ...(k8sFormat ? {
        apiVersion: 'kuma.io/v1alpha1',
      } : {}),
      type: 'MeshTrust',
      mesh,
      name,
      creationTime: fake.date.past().toISOString(),
      modificationTime: fake.date.recent().toISOString(),
      ...((() => {
        const metadata = {
          mesh,
          name,
          labels: {
            ...fake.kuma.labels({
              name: displayName,
              ...(zone ? { zone } : {}),
              ...(k8s ? { namespace: nspace } : {}),
            }),
          },
        }
        return k8sFormat ? { metadata } : metadata
      })()),
      spec: {
        caBundles: [{
          pem: {
            value: fake.kuma.certificate(false),
          },
          type: 'Pem',
        }],
        trustDomain: `${mesh}.${fake.word.noun()}.mesh.local`,
      },
      status: {
        origin: {
          kri: fake.kuma.kri({ resourceName: 'MeshIdentity', mesh, namespace, zone }),
        },
      },
    } satisfies MeshTrustResponse,
  }
}
