import type { Dependencies, ResponseHandler } from '#mocks'

export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  // this template can be called via the /_kri/kri_<shortName>_:kri endpoint or
  // the legacy endpoint
  const kri = req.params.kri ? `kri_ze_${req.params.kri}` : undefined
  const [
    _prefix,
    _shortName,
    _mesh,
    zone,
    nspace,
    displayName,
  ] = kri ? kri.split('_') : [
    'kri', // prefix
    'ze', // shortName
    String(req.params.mesh), // mesh
    // we can't know the zone for a non-KRI version of this request
    fake.word.noun(), // zone.
    // with k8s the request.name MUST be use the correct `name.ns` format
    ...(k8s ? String(req.params.name).split('.').toReversed() : ['', String(req.params.name)]), // nspace, displayName
  ]
  const name = kri ? `${displayName}${nspace ? `.${nspace}` : ''}` : String(req.params.name)

  return {
    headers: {},
    body: {
      ...(req.url.searchParams.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'ZoneEgress',
      name,
      creationTime: '2021-07-13T08:40:59Z',
      modificationTime: '2021-07-13T08:40:59Z',
      zone,
      networking: {
        address: fake.internet.ip(),
        port: fake.internet.port(),
        admin: {
          port: fake.internet.port(),
        },
      },
    },
  }
}
