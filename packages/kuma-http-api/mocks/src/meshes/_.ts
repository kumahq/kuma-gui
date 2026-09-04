import type { Dependencies, ResponseHandler } from '#mocks'
export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  // this template can be called via the /_kri/kri_<shortName>_:kri endpoint or
  // the legacy endpoint
  const kri = req.params.kri ? `kri_m_${req.params.kri}` : undefined
  const [
    _prefix,
    shortName,
    mesh,
    zone,
    nspace,
    displayName,
  ] = kri ? kri.split('_') : [
    'kri', // prefix
    'm', // shortName
    '', // mesh
    '', // zone
    // with k8s the request.name MUST be use the correct `name.ns` format
    ...['', String(req.params.name)], // nspace, displayName
  ]
  const name = kri ? `${displayName}${nspace ? `.${nspace}` : ''}` : String(req.params.name)

  const isMtlsEnabledOverride = env('KUMA_MTLS_ENABLED', '')
  const isMtlsEnabled = isMtlsEnabledOverride !== '' ? isMtlsEnabledOverride === 'true' : fake.datatype.boolean()

  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      ...(req.url.searchParams.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      name,
      type: 'Mesh',
      creationTime: '2020-06-19T12:18:02.097986-04:00',
      modificationTime: '2020-07-19T12:18:02.097986-04:00',
      kri: fake.kuma.kri({ shortName, mesh, zone, namespace: nspace, displayName }),
      // meshes only seem to have displayName
      labels: fake.kuma.labels({
        name: displayName,
      }),
      meshServices: {
        mode: env('KUMA_MESHSERVICE_MODE', 'Everywhere'),
      },
      ...(isMtlsEnabled &&
      {
        mtls: {
          enabledBackend: 'ca-1',
          backends: [
            {
              name: 'ca-1',
              type: 'provided',
              dpCert: {
                rotation: {
                  expiration: '1d',
                },
              },
              conf: {
                cert: {
                  secret: 'name-of-secret',
                },
                key: {
                  secret: 'name-of-secret',
                },
              },
            },
            {
              name: 'ca-2',
              type: 'BUILTIN',
            },
          ],
        },
      }),
    },
  }
}
