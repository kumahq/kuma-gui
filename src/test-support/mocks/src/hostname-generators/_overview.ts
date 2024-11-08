import type { HostnameGeneratorItem } from '@/app/hostname-generators/data'
import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const { offset, total, next, pageTotal } = pager(
    `${fake.number.int({ min: 1, max: 100 })}`,
    req,
    '/hostname-generators/_overview',
  )

  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i): HostnameGeneratorItem => {
        const meshServiceType = fake.kuma.meshServiceTypeSelector()
        const matchLabels = {
          'kuma.io/origin': fake.kuma.origin(),
          'kuma.io/env': fake.kuma.env(),
        }
        const namespace = fake.hacker.noun()
        const displayName = `${fake.science.chemicalElement().name.toLowerCase()}-${offset + i}-service`
        const creationTime = fake.date.past()

        return {
          type: 'HostnameGenerator',
          name: `${displayName}${k8s ? `.${namespace}` : ''}`,
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
              [meshServiceType]: { matchLabels },
            },
            template: fake.kuma.hostnameTemplate({
              external: meshServiceType === 'meshExternalService',
              multizone: meshServiceType === 'meshMultiZoneService',
              withNamespace: fake.datatype.boolean(),
              withZone: fake.datatype.boolean(),
            }),
          },
          creationTime: creationTime.toISOString(),
          modificationTime: fake.date.between({ from: creationTime, to: Date.now() }).toISOString(),
        } satisfies HostnameGeneratorItem
      }),
      next,
    },
  }
}
