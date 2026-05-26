import type { Dependencies, ResponseHandler } from '#mocks'
import type { MeshGateway } from '@/types/index.d'

export default ({ env, fake }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  // this template can be called via the /_kri/kri_<shortName>_:kri endpoint or
  // the legacy endpoint
  const kri = req.params.kri ? `kri_mgw_${req.params.kri}` : undefined
  const [
    _prefix,
    _shortName,
    mesh,
    zone,
    nspace,
    displayName,
  ] = kri ? kri.split('_') : [
    'kri', // prefix
    'mgw', // shortName
    String(req.params.mesh), // mesh
    fake.helpers.arrayElement(['', fake.word.noun()]), // zone
    // with k8s the request.name MUST be use the correct `name.ns` format
    ...(k8s ? String(req.params.name).split('.').toReversed() : ['', String(req.params.name)]), // nspace, displayName
  ]
  const name = kri ? `${displayName}${nspace ? `.${nspace}` : ''}` : String(req.params.name)

  const listenerCount = parseInt(env('KUMA_LISTENER_COUNT', `${fake.number.int({ min: 1, max: 3 })}`))

  return {
    headers: {},
    body: {
      // Just a quick, obvious way to verify the “Copy as Kubernetes” copy button functionality.
      ...(req.url.searchParams.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'MeshGateway',
      mesh,
      name,
      creationTime: '2022-01-25T13:55:51.798701+01:00',
      modificationTime: '2022-01-25T13:55:51.798701+01:00',
      labels: {
        ...fake.kuma.labels({
          name: displayName,
          ...(zone ? { zone } : {}),
          ...(k8s ? { namespace: nspace } : {}),
        }),
      },
      selectors: [{ match: fake.kuma.tags({ service: name }) }],
      conf: {
        listeners: Array.from({ length: listenerCount }).map(() => {
          return {
            hostname: `${fake.internet.domainWord()}.${fake.internet.domainName()}`,
            port: fake.internet.port(),
            protocol: fake.helpers.weightedArrayElement<'HTTP' | 'HTTPS' | 'TCP' | 'TLS'>([
              { value: 'HTTP', weight: 3 },
              { value: 'HTTPS', weight: 3 },
              { value: 'TCP', weight: 1 },
              { value: 'TLS', weight: 1 },
            ]),
            ...(fake.datatype.boolean({ probability: 0.2 }) && {
              tags: fake.kuma.tags({}),
            }),
            ...(fake.datatype.boolean() && {
              crossMesh: true,
            }),
            ...(fake.datatype.boolean() && {
              tls: {
                mode: fake.helpers.arrayElement<'TERMINATE' | 'PASSTHROUGH'>(['TERMINATE', 'PASSTHROUGH']),
              },
            }),
          }
        }),
      },
    } satisfies MeshGateway,
  }
}
