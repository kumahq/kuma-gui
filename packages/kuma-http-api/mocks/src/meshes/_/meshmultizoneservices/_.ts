import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'
type Entity = components['schemas']['MeshMultiZoneServiceItem']

export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  // this template can be called via the /_kri/kri_<shortName>_:kri endpoint or
  // the legacy endpoint
  const kri = req.params.kri ? `kri_mzsvc_${req.params.kri}` : undefined
  const [
    _prefix,
    _shortName,
    mesh,
    _zone,
    nspace,
    displayName,
  ] = kri ? kri.split('_') : [
    'kri', // prefix
    'mzsvc', // shortName
    String(req.params.mesh), // mesh
    '', // zone
    // with k8s the request.name MUST be use the correct `name.ns` format
    ...(k8s ? String(req.params.name).split('.').toReversed() : ['', String(req.params.name)]), // nspace, displayName
  ]
  const name = kri ? `${displayName}${nspace ? `.${nspace}` : ''}` : String(req.params.name)

  const serviceCount = parseInt(env('KUMA_SERVICE_COUNT', `${fake.number.int({ min: 1, max: 120 })}`))

  const k8sFormat = req.url.searchParams.get('format') === 'kubernetes'
  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      ...(k8sFormat ? {
        apiVersion: 'kuma.io/v1alpha1',
      } : {}),
      type: 'MeshMultiZoneService',
      mesh,
      name,
      ...fake.kuma.timespan(),
      labels: {
        ...fake.kuma.labels({
          name: displayName,
          ...(k8s ? { namespace: nspace } : {}),
        }),
      },
      kri: fake.kuma.kri({ resourceName: 'MeshService', mesh, zone: '', namespace: nspace, name: displayName || name, sectionName: '' }),
      spec: {
        selector: {
          meshService: {
            matchLabels: fake.kuma.tags({}),
          },
        },
        ports: Array.from({ length: 5 }).map(_ => (
          {
            name: fake.helpers.arrayElement([fake.word.noun(), String(fake.internet.port())]),
            port: fake.internet.port(),
            targetPort: fake.internet.port(),
            appProtocol: fake.kuma.protocol(),
          }
        )),
      },
      status: {
        meshServices: Array.from({ length: serviceCount }).map((_, i) => ({
          name: `${fake.word.noun()}-${i}`,
          mesh: fake.word.noun(),
          namespace: `${k8s ? `${fake.k8s.namespace()}` : ''}`,
          zone: fake.word.noun(),
        })),
        addresses: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map(_ => ({
          hostname: fake.internet.domainName(),
        })),
        vips: Array.from({ length: fake.number.int({ min: 1, max: 5 }) }).map(_ => ({
          ip: fake.internet.ip(),
        })),
      },
    } satisfies Entity & {
      creationTime: string
      modificationTime: string
    },
  }
}
