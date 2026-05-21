import type { Dependencies, ResponseHandler } from '#mocks'
import type { paths } from '@kumahq/kuma-http-api'

type MeshTrustResponse = paths['/meshes/{mesh}/meshtrusts/{name}']['get']['responses']['200']['content']['application/json']

export default ({ fake }: Dependencies): ResponseHandler => (req) => {
  const kri = req.params.kri as string | undefined
  const [
    mesh = req.params.mesh as string,
    _zone,
    _namespace,
    name = req.params.name as string,
  ] = kri?.split('_') ?? ''
  const k8s = req.url.searchParams.get('format') === 'kubernetes'
  const namespace = fake.word.noun()
  const zone = fake.word.noun()
  const origin = fake.kuma.origin()

  return {
    headers: {},
    body: {
      type: 'MeshTrust',
      ...(k8s && { apiVersion: 'kuma.io/v1alpha1' }),
      ...(k8s && { kind: 'MeshTrust' }),
      mesh,
      name,
      ...((() => {
        const metadata = {
          mesh,
          name,
          labels: {
            'k8s.kuma.io/namespace': fake.word.noun(),
            'kuma.io/env': k8s ? 'kubernetes' : 'universal',
            'kuma.io/mesh': mesh,
            'kuma.io/origin': origin,
            ...(origin === 'zone' && { 'kuma.io/zone': zone }),
          },
        }
        return k8s ? { metadata } : metadata
      })()),
      ...(!k8s && {
        creationTime: fake.date.past().toISOString(),
        modificationTime: fake.date.recent().toISOString(),
      }),
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
