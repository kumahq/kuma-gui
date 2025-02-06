import type { EndpointDependencies, MockResponder } from '@/test-support'
import { paths } from '@/types/auto-generated'

type HostnamesResponse = paths['/meshes/{mesh}/{serviceType}/{serviceName}/_hostnames']['get']['responses']['200']['content']['application/json']

export default ({ fake }: EndpointDependencies): MockResponder => (req) => {
  const total = fake.number.int({ min: 1, max: 5 })
  const [displayName] = (req.params.serviceName as string).split('.')

  const body = {
    total,
    items: Array.from({ length: total }).map(() => {
      const namespace = fake.k8s.namespace()
      const hostnameTemplate = fake.kuma.hostnameTemplate({ withNamespace: fake.datatype.boolean(), multizone: true })

      return {
        hostname: hostnameTemplate.replace('{{ .DisplayName }}', displayName).replace('{{ .Namespace }}', namespace),
        zones: Array.from({ length: fake.number.int({ min: 1, max: 5 })}).map(() => ({
          name: fake.word.noun(),
        })), 
      }
    }),
  } satisfies HostnamesResponse

  return {
    headers: {},
    body,
  }
}
