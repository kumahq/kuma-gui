import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'

type HostnameGenerator = components['responses']['HostnameGeneratorItem']['content']['application/json']

export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const kri = req.params.kri as string | undefined
  const origin = fake.kuma.origin()
  
  const [
    _mesh,
    zone = origin === 'zone' ? fake.word.noun() : '',
    namespace,
    name = req.params.name as string,
  ] = kri?.split('_') ?? ''
  
  const meshServiceTypeSelector = fake.kuma.meshServiceTypeSelector()
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const creationTime = fake.date.past()

  const parts = name.split('.')
  const displayName = parts.slice(0, Math.max(1, parts.length - 1)).join('.')
  const nspace = parts.length > 1 ? parts.pop() : namespace

  const body = {
    ...(req.url.searchParams.get('format') === 'kubernetes' && {
      apiVersion: 'kuma.io/v1alpha1',
    }),
    type: 'HostnameGenerator',
    name,
    kri: fake.kuma.kri({ resourceName: 'HostnameGenerator', mesh: '', zone, namespace: nspace, name: displayName, sectionName: '' }),
    labels: {
      ...(k8s && {
        'k8s.kuma.io/namespace': nspace ?? fake.k8s.namespace(),
      }),
      'kuma.io/display-name': displayName,
      'kuma.io/env': fake.kuma.env(),
      'kuma.io/origin': origin,
      ...(origin === 'zone' && {
        'kuma.io/zone': zone,
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
    creationTime: creationTime.toISOString(),
    modificationTime: fake.date.between({ from: creationTime, to: Date.now() }).toISOString(),
  } satisfies HostnameGenerator

  return {
    headers: {},
    body,
  }
}
