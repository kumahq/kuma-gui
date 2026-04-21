import type { Dependencies, ResponseHandler } from '#mocks'
import type { paths } from '../../..'

type ZoneEgressResponse = paths['/zoneegresses/{name}']['get']['responses']['200']['content']['application/json']

export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  // this template can be called via the /_kri/kri_<shortName>_:kri endpoint or
  // the legacy endpoint
  const kri = req.params.kri ? `kri_ze_${req.params.kri}` : undefined
  console.log('kri', kri)
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
    '', // mesh
    // we can't know the zone for a non-KRI version of this request
    fake.word.noun(), // zone.
    // with k8s the request.name MUST be use the correct `name.ns` format
    ...(k8s ? String(req.params.name).split('.').toReversed() : ['', String(req.params.name)]), // nspace, displayName
  ]
  const name = kri ? `${displayName}${nspace ? `.${nspace}` : ''}` : String(req.params.name)
  console.log({ name })

  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      ...(req.url.searchParams.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'ZoneEgress',
      name,
      ...fake.kuma.timespan(),
      kri: fake.kuma.kri({ resourceName: 'ZoneEgress', mesh: '', zone, namespace: nspace, name: displayName, sectionName: '' }),
      zone,
      networking: {
        address: fake.internet.ip(),
        port: fake.internet.port(),
        admin: {
          port: fake.internet.port(),
        },
      },
    } satisfies ZoneEgressResponse,
  }
}
