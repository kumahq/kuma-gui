import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '@kumahq/kuma-http-api'

type HostnameGenerator = components['responses']['HostnameGeneratorItem']['content']['application/json']

export default ({ fake, pager, env }: Dependencies): ResponseHandler => (req) => {
  const { offset, total, next, pageTotal } = pager(
    `${fake.number.int({ min: 1, max: 100 })}`,
    req,
    '/hostname-generators/_overview',
  )
  const query = req.url.searchParams

  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'
  const nameQuery = query.get('name')
  const namespaceQuery = query.get('filter[labels.k8s.kuma.io/namespace]')
  const zoneQuery = query.get('filter[labels.kuma.io/zone]')

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const meshServiceTypeSelector = fake.kuma.meshServiceTypeSelector()
        const namespace = namespaceQuery ?? fake.word.noun()
        const displayName = `${nameQuery?.padEnd(nameQuery.length + 1, '-') ?? ''}${fake.science.chemicalElement().name.toLowerCase()}-${offset + i}-service`
        const creationTime = fake.date.past()
        const zone = zoneQuery ?? fake.word.noun()

        return {
          type: 'HostnameGenerator',
          name: `${displayName}${k8s ? `.${namespace}` : ''}`,
          labels: k8s
            ? {
              'kuma.io/display-name': displayName,
              'k8s.kuma.io/namespace': namespace,
              'kuma.io/env': fake.kuma.env(),
              'kuma.io/mesh': 'default',
              'kuma.io/origin': zoneQuery ? 'zone' : fake.kuma.origin(),
              'kuma.io/zone': zone,
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
        } satisfies HostnameGenerator
      }),
      next,
    },
  }
}
