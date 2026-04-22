import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'

type HostnameGenerator = components['responses']['HostnameGeneratorItem']['content']['application/json']

export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const origin = fake.kuma.origin()
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const kri = req.params.kri ? `kri_mal_${req.params.kri}` : undefined
  const [
    _prefix,
    _shortName,
    _mesh,
    zone,
    nspace,
    displayName,
  ] = kri ? kri.split('_') : [
    'kri', // prefix
    'hg', // shortName
    '', // mesh
    fake.helpers.arrayElement(['', fake.word.noun()]), // zone
    // with k8s the request.name MUST be use the correct `name.ns` format
    ...(k8s ? String(req.params.name).split('.').toReversed() : ['', String(req.params.name)]), // nspace, displayName
  ]
  
  const meshServiceTypeSelector = fake.kuma.meshServiceTypeSelector()

  return {
    headers: {
      ...(fake.datatype.boolean() ? { 'Transfer-Encoding': 'chunked' } : {}),
    },
    body: {
      ...(req.url.searchParams.get('format') === 'kubernetes' && {
        apiVersion: 'kuma.io/v1alpha1',
      }),
      type: 'HostnameGenerator',
      name: displayName,
      kri: fake.kuma.kri({ resourceName: 'HostnameGenerator', mesh: '', zone, namespace: nspace, name: displayName, sectionName: '' }),
      ...fake.kuma.timespan(),
      labels: {
        ...fake.kuma.labels({
          name: displayName,
          ...(zone ? { zone } : {}),
          ...(k8s ? { namespace: nspace } : {}),
        }),
      },
      spec: {
        selector: {
          [meshServiceTypeSelector]: {
            matchLabels: {
              'kuma.io/origin': fake.kuma.origin(),
              'kuma.io/env': fake.kuma.env(),
            },
          },
        },
        template: fake.kuma.hostnameTemplate({
          external: meshServiceTypeSelector === 'meshExternalService',
          multizone: meshServiceTypeSelector === 'meshMultiZoneService',
          withNamespace: fake.datatype.boolean(),
          withZone: fake.datatype.boolean(),
        }),
      },
    } satisfies HostnameGenerator,
  }
}
