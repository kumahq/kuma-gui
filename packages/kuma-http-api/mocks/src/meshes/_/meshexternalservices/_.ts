import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'
type Entity = components['schemas']['MeshExternalServiceItem']

export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const query = req.url.searchParams

  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  // this template can be called via the /_kri/kri_<shortName>_:kri endpoint or
  // the legacy endpoint
  const kri = req.params.kri ? `kri_extsvc_${req.params.kri}` : undefined
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
    'extsvc', // shortName
    String(req.params.mesh), // mesh
    fake.helpers.arrayElement(['', fake.word.noun()]), // zone
    ...String(req.params.name).split('.').toReversed(), // nspace, displayName
  ]
  const name = kri ? `${displayName}${nspace ? `.${nspace}` : ''}` : String(req.params.name)

  return {
    headers: {},
    body: {
      ...(query.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'MeshExternalService',
      mesh,
      name,
      creationTime: '2021-02-19T08:06:15.14624+01:00',
      modificationTime: '2021-02-19T08:07:37.539229+01:00',
      labels: {
        ...fake.kuma.labels({
          name: displayName,
          ...(zone ? { zone } : {}),
          ...(k8s ? { namespace: nspace } : {}),
        }),
      },
      spec: {
        match: {
          type: 'HostnameGenerator',
          port: fake.internet.port(),
          protocol: fake.kuma.protocol(),
        },
        endpoints: [
          {
            address: fake.internet.domainName(),
            port: fake.internet.port(),
          },
        ],
        tls: {
          allowRenegotiation: fake.datatype.boolean(),
          enabled: fake.datatype.boolean(),
        },
      },
      status: {
        addresses: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map(_ => ({
          hostname: fake.internet.domainName(),
        })),
        vip: {
          ip: fake.internet.ip(),
        },
      },
    } satisfies Entity & {
      creationTime: string
      modificationTime: string
    },
  }
}
