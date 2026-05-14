import type { Dependencies, ResponseHandler } from '#mocks'
import type { MeshHTTPRoute } from '@/types'

export default ({ env, fake }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  // this template can be called via the /_kri/kri_<shortName>_:kri endpoint or
  // the legacy endpoint
  const kri = req.params.kri ? `kri_mhttpr_${req.params.kri}` : undefined
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
    'mhttpr', // shortName
    String(req.params.mesh), // mesh
    fake.helpers.arrayElement(['', fake.word.noun()]), // zone
    ...String(req.params.name).split('.').toReversed(), // nspace, displayName
  ]
  const name = kri ? `${displayName}${nspace ? `.${nspace}` : ''}` : String(req.params.name)
  const k8sFormat = req.url.searchParams.get('format') === 'kubernetes'


  const ruleMatchCount = parseInt(env('KUMA_RULE_MATCH_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))
  return {
    headers: {},
    body: {
      ...(k8sFormat ? {
        apiVersion: 'kuma.io/v1alpha1',
      } : {}),
      type: 'MeshHTTPRoute',
      mesh,
      name,
      creationTime: '2024-03-01T09:20:28Z',
      modificationTime: '2024-03-01T09:20:28Z',
      labels: {
        ...fake.kuma.labels({
          name: displayName,
          ...(zone ? { zone } : {}),
          ...(k8s ? { namespace: nspace } : {}),
        }),
      },
      spec: {
        targetRef: {
          kind: 'MeshGateway',
          name: 'demo-app',
        },
        to: [
          {
            targetRef: {
              kind: 'Mesh',
            },
            rules: [
              {
                matches: Array.from({ length: ruleMatchCount }).map(() => fake.kuma.ruleMatch()),
                default: {
                  backendRefs: [
                    {
                      kind: 'MeshService',
                      name: 'demo-app_kuma-demo_svc_5000',
                      weight: 1,
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    } satisfies MeshHTTPRoute,
  }
}
