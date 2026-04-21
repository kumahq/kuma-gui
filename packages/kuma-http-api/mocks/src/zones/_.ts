import type { Dependencies, ResponseHandler } from '#mocks'

export default ({ fake }: Dependencies): ResponseHandler => (req) => {
  // this template can be called via the /_kri/kri_<shortName>_:kri endpoint or
  // the legacy endpoint
  const kri = req.params.kri ? `kri_ze_${req.params.kri}` : undefined
  const [
    _prefix,
    _shortName,
    _mesh,
    _zone,
    _nspace,
    displayName,
  ] = kri ? kri.split('_') : [
    'kri', // prefix
    'z', // shortName
    '', // mesh
    // we can't know the zone for a non-KRI version of this request
    '', // zone.
    // with k8s the request.name MUST be use the correct `name.ns` format
    String(req.params.name), // displayName
  ]
  const name = kri ? displayName : String(req.params.name)
  switch (req.method.toUpperCase()) {
    case 'DELETE':
      return {
        headers: {
          ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
        },
        body: {},
      }
    default:
      return {
        headers: {
          ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
        },
        body: {
          type: 'Zone',
          kri: fake.kuma.kri({ resourceName: 'Zone', zone: '', mesh: '', namespace: '', name, sectionName: '' }),
          name: req.params.name,
          creationTime: '2021-02-19T08:06:15.380674+01:00',
          modificationTime: '2021-02-19T08:06:15.380674+01:00',
          enabled: true,
        },
      }
  }
}
