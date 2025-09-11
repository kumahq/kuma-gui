import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { components } from '@kumahq/kuma-http-api'


export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const mesh = params.mesh as string
  const name = params.name as string
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
