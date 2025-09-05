import type { EndpointDependencies, MockResponder } from '@/test-support'
import type { components } from '@kumahq/kuma-http-api'


export default ({ fake, env }: EndpointDependencies): MockResponder => (req) => {
  const params = req.params
  const mesh = params.mesh as string
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const itemsCount = parseInt(env('KUMA_MESHTRUST_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))
  const namespace = fake.word.noun()
  const zone = fake.word.noun()
  return {
    headers: {},
    body: {
      items: Array.from({ length: itemsCount }, () => ({
        type: 'MeshTrust',
        mesh,
        name: fake.word.noun(),
        labels: {
          'k8s.kuma.io/namespace': fake.word.noun(),
          'kuma.io/env': k8s ? 'kubernetes' : 'universal',
          'kuma.io/mesh': mesh,
          'kuma.io/origin': origin,
          ...(origin === 'zone' && { 'kuma.io/zone': zone }),
        },
        creationTime: fake.date.past().toISOString(),
        modificationTime: fake.date.recent().toISOString(),
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
        },
      }) satisfies components['schemas']['MeshTrustItem']),
    },
  }
}
