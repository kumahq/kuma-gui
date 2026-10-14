import type { Dependencies, ResponseHandler } from '#mocks'
import type { paths } from '@kumahq/kuma-http-api'

type MeshTrustsResponse = paths['/meshes/{mesh}/meshtrusts']['get']['responses']['200']['content']['application/json']

export default ({ fake, env, pager }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  const { offset, total, next, pageTotal } = pager(
    env('KUMA_MESHTRUST_COUNT', `${fake.number.int({ min: 1, max: 3 })}`),
    req,
    `/meshes/${req.params.mesh}/meshtrusts`,
  )

  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }, (_, i) => {
        const id = offset + i
        const [
          _prefix,
          shortName,
          mesh,
          zone,
          nspace,
          displayName,
        ] = [
          'kri', // prefix
          'mtrust', // shortName
          String(req.params.mesh), // mesh
          fake.helpers.arrayElement(['', fake.word.noun()]), // zone
          ...([k8s ? fake.word.noun() : '', `${fake.word.noun()}-${id}`]), // nspace, displayName
        ]
        const name = `${displayName}${nspace ? `.${nspace}` : ''}`

        return {
          ...fake.kuma.timespan(),
          type: 'MeshTrust',
          mesh,
          name,
          kri: fake.kuma.kri({ shortName, mesh, zone, namespace: nspace, displayName }),
          labels: fake.kuma.labels({
            name: displayName,
            mesh,
            env: k8s ? 'kubernetes' : 'universal',
            ...(zone ? { zone } : {}),
            ...(k8s ? { namespace: nspace } : {}),
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
              kri: fake.kuma.kri({ resourceName: 'MeshIdentity', mesh, zone, namespace: fake.word.noun() }),
            },
          },
        }
      }),
    } satisfies MeshTrustsResponse,
  }
}
