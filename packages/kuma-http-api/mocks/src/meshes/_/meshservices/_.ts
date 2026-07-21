import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'
type Entity = components['schemas']['MeshServiceItem']

export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const query = req.url.searchParams
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  // this template can be called via the /_kri/kri_<shortName>_:kri endpoint or
  // the legacy endpoint
  const kri = req.params.kri ? `kri_msvc_${req.params.kri}` : undefined
  const [
    _prefix,
    _shortName,
    mesh,
    zone,
    nspace,
    displayName,
  ] = kri ? kri.split('_') : [
    'kri', // prefix
    'msvc', // shortName
    String(req.params.mesh), // mesh
    fake.helpers.arrayElement(['', fake.word.noun()]), // zone
    // with k8s the request.name MUST be use the correct `name.ns` format
    ...(k8s ? String(req.params.name).split('.').toReversed() : ['', String(req.params.name)]), // nspace, displayName
  ]
  const name = kri ? `${displayName}${nspace ? `.${nspace}` : ''}` : String(req.params.name)

  const proxies = fake.number.int({ min: 1, max: 120 })

  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      ...(query.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'MeshService',
      mesh,
      name,
      kri: fake.kuma.kri({ resourceName: 'MeshService', mesh, zone, namespace: nspace, name: displayName || name, sectionName: '' }),
      ...fake.kuma.timespan(),
      labels: {
        ...fake.kuma.labels({
          name: displayName,
          ...(zone ? { zone } : {}),
          ...(k8s ? { namespace: nspace } : {}),
        }),
      },
      spec: {
        ports: Array.from({ length: 5 }).map(_ => (
          {
            name: fake.helpers.arrayElement([fake.word.noun(), String(fake.internet.port())]),
            port: fake.internet.port(),
            targetPort: fake.internet.port(),
            appProtocol: fake.kuma.protocol(),
          }
        )),
        selector: {
          dataplaneTags: fake.kuma.tags({}),
        },
        state: fake.helpers.arrayElement(['Available', 'Unavailable']),
        identities: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map((_, index) => {
          const type = fake.helpers.arrayElement(['ServiceTag', 'SpiffeID'])
          return {
            type,
            value: type === 'ServiceTag' ? `${fake.word.noun()}-${index + 1}` : fake.kuma.spiffeId({ mesh, namespace: nspace, sa: name }),
          }
        }),
      },
      status: {
        addresses: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map(_ => ({
          hostname: fake.internet.domainName(),
        })),
        vips: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map(_ => ({
          ip: fake.internet.ip(),
        })),
        tls: {
          status: fake.helpers.arrayElement([undefined, 'Ready', 'NotReady']),
        },
        dataplaneProxies: {
          connected: fake.number.int({ min: 1, max: proxies }),
          healthy: fake.number.int({ min: 1, max: proxies }),
          total: proxies,
        },
      },
    } satisfies Entity & {
      creationTime: string
      modificationTime: string
    },
  }
}
