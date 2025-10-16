import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'


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
  return {
    headers: {},
    body: {
      ...(k8s && { apiVersion: 'kuma.io/v1alpha1' }),
      ...(k8s ? { kind: 'MeshTrust' } : { type: 'MeshTrust' }),
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
        origin: {
          kri: fake.kuma.kri({ shortName: 'mid', mesh, namespace, zone }),
        },
        trustDomain: `${mesh}.${fake.word.noun()}.mesh.local`,
      } satisfies components['schemas']['MeshTrustItem']['spec'],
    },
  }
}
