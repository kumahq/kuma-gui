import type { HostnameGeneratorItem } from '@/app/hostname-generators/data'
import type { EndpointDependencies, MockResponder } from '@/test-support'

export default ({ fake, env }: EndpointDependencies): MockResponder => (req) => {
  const { params } = req
  const name = params.name as string
  const [displayName = '', namespace = ''] = name.split('.')
  const meshServiceTypeSelector = fake.kuma.meshServiceTypeSelector()
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const creationTime = fake.date.past()

  const body = {
    type: 'HostnameGenerator',
    name,
    labels: k8s
      ? {
        'kuma.io/display-name': displayName,
        'k8s.kuma.io/namespace': namespace,
        'kuma.io/env': fake.kuma.env(),
        'kuma.io/mesh': 'default',
        'kuma.io/origin': fake.kuma.origin(),
        'kuma.io/zone': fake.hacker.noun(),
      }
      : {},
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
  } satisfies HostnameGeneratorItem

  return {
    headers: {},
    body,
  }
}
